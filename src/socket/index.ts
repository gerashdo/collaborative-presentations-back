import { Server as HTTPServer } from 'http'
import { Server, Socket } from 'socket.io'
import { addUserToPresentation, createNewSlideInPresentation, getPresentation, removeSlideFromPresentation, removeUserFromPresentation, updateUserRole } from '../services/presentation'
import { getUserById } from '../services/user'
import { addElementToSlide, removeElementFromSlide } from '../services/slide'
import { updateSlideElement } from '../services/slideElement'
import { CreateNewSlidePayload, RemoveSlidePayload, UpdateUserRolePayload, UserJoinPresentationPayload, UserLeavePresentationPayload, UserRole } from '../interfaces/presentation'
import { SOCKET_EVENTS } from '../interfaces/events'
import { AddElementToSlidePayload } from '../interfaces/slide'
import { RemoveSlideElementPayload, UpdateSlideElementPayload } from '../interfaces/slideElement'


export const setupSocket = (server: HTTPServer) => {

  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  })

  io.on('connection', (socket: Socket) => {
    console.log('A user connected:', socket.id)

    socket.on(SOCKET_EVENTS.JOIN_PRESENTATION, async ({ presentationId, userId }: UserJoinPresentationPayload) => {
      console.log('User joined presentation:', presentationId, userId)
      try {
        const presentation = await addUserToPresentation(presentationId, userId)
        socket.join(presentationId);
        io.to(presentationId).emit(SOCKET_EVENTS.USER_JOINED, {
          presentation
        })
      } catch (error) {
        console.error('Error joining presentation:', error);
        socket.emit(SOCKET_EVENTS.ERROR, { message: 'Server error.' })
      }
    })

    socket.on(SOCKET_EVENTS.LEAVE_PRESENTATION, async ({ presentationId, userId }: UserLeavePresentationPayload) => {
      console.log('User left presentation:', presentationId, userId)
      try {
        const presentation = await removeUserFromPresentation(presentationId, userId)
        io.to(presentationId).emit(SOCKET_EVENTS.USER_LEFT, {
          presentation
        })
      } catch (error) {
        console.error('Error leaving presentation:', error)
        socket.emit(SOCKET_EVENTS.ERROR, { message: 'Server error.' })
      }
    })

    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      console.log('User disconnected:', socket.id)
    })

    socket.on(SOCKET_EVENTS.UPDATE_USER_ROLE, async ({ presentationId, userId, role }: UpdateUserRolePayload) => {
      console.log('Update user role:', presentationId, userId, role)
      try {
        const presentation = await updateUserRole(presentationId, userId, role)
        io.to(presentationId).emit(SOCKET_EVENTS.USER_ROLE_UPDATED, {
          presentation
        })
      } catch (error) {
        console.error('Error assigning role:', error)
        socket.emit('error', { message: 'Server error.' })
      }
    })

    socket.on(SOCKET_EVENTS.ADD_SLIDE, async ({ presentationId }: CreateNewSlidePayload) => {
      try {
        const presentation = await createNewSlideInPresentation(presentationId)
        io.to(presentationId).emit(SOCKET_EVENTS.SLIDE_ADDED, {
          presentation,
        })
      } catch (error) {
        console.error('Error adding slide:', error)
        socket.emit(SOCKET_EVENTS.ERROR, { message: 'Server error.' })
      }
    })

    socket.on(SOCKET_EVENTS.REMOVE_SLIDE, async ({presentationId, slideId}: RemoveSlidePayload) => {
      try {
        const presentation = await removeSlideFromPresentation(presentationId, slideId)
        io.to(presentationId).emit(SOCKET_EVENTS.SLIDE_REMOVED, {
          presentation
        })
      } catch (error) {
          console.error('Error removing slide:', error)
          socket.emit(SOCKET_EVENTS.ERROR, { message: 'Server error.' })
      }
    })

    socket.on(SOCKET_EVENTS.ADD_ELEMENT_TO_SLIDE, async ({ presentationId, slideId, element }: AddElementToSlidePayload) => {
      try {
        console.log('Add element to slide:', presentationId, slideId, element)
        const slide = await addElementToSlide(slideId, element)
        io.to(presentationId).emit(SOCKET_EVENTS.SLIDE_UPDATED, {
          slide,
          presentationId,
        })
      } catch (error) {
        console.error('Error adding element to slide:', error)
        socket.emit(SOCKET_EVENTS.ERROR, { message: 'Server error.' })
      }
    })

    socket.on(SOCKET_EVENTS.REMOVE_ELEMENT_FROM_SLIDE, async ({presentationId, slideId, elementId}: RemoveSlideElementPayload) => {
      try {
        const slide = await removeElementFromSlide(slideId, elementId)
        io.to(presentationId).emit(SOCKET_EVENTS.SLIDE_UPDATED, {
          presentationId,
          slide,
        })
      } catch (error) {
        console.error('Error removing element from slide:', error)
        socket.emit(SOCKET_EVENTS.ERROR, { message: 'Server error.' })
      }
    })

    socket.on(SOCKET_EVENTS.UPDATE_SLIDE_ELEMENT, async ({presentationId, slideId, elementId, element}: UpdateSlideElementPayload) => {
      console.log('Update slide element:', presentationId, slideId, elementId, element)
      try {
        const updatedElement = await updateSlideElement(elementId, element)
        io.to(presentationId).emit(SOCKET_EVENTS.SLIDE_ELEMENT_UPDATED, {
          slideId,
          element: updatedElement,
        })
      } catch (error) {
        console.error('Error updating slide element:', error)
        socket.emit(SOCKET_EVENTS.ERROR, { message: 'Server error.' })
      }
    })
  })
}
