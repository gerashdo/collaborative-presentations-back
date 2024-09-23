import { Server as HTTPServer } from 'http'
import { Server, Socket } from 'socket.io'
import { getPresentation } from '../services/presentation'
import { getUserById } from '../services/user'
import { UserJoinPresentationPayload, UserLeavePresentationPayload, UserRole } from '../interfaces/presentation'
import { SOCKET_EVENTS } from '../interfaces/events'

export const setupSocket = (server: HTTPServer) => {

  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  })

  io.on('connection', (socket: Socket) => {
    console.log('A user connected:', socket.id);

    socket.on(SOCKET_EVENTS.JOIN_PRESENTATION, async ({ presentationId, userId }: UserJoinPresentationPayload) => {
      console.log('User joined presentation:', presentationId, userId)
      try {
        let presentation = await getPresentation(presentationId)
        if (!presentation) {
          socket.emit(SOCKET_EVENTS.ERROR, { message: 'Presentation not found.' })
          console.log('Presentation not found:', presentationId)
          return
        }

        const user = await getUserById(userId)
        if (!user) {
          socket.emit(SOCKET_EVENTS.ERROR, { message: 'User not found.' })
          console.log('User not found:', userId)
          return
        }

        const userInPresentation = presentation.users.find((u) => u.user.id === user.id)
        if (userInPresentation) {
          socket.emit(SOCKET_EVENTS.ERROR, { message: 'User is already in the presentation.' })
          console.log('User is already in the presentation:', user.id)
          return
        }

        presentation.users.push({
          user: user._id,
          role: user.id === presentation.creator.id ? UserRole.EDITOR : UserRole.VIEWER,
        });
        presentation = await presentation.save()

        socket.join(presentationId);
        io.to(presentationId).emit(SOCKET_EVENTS.USER_JOINED, {
          presentation: await presentation.populate({
            path: 'users',
            populate: { path: 'user' }
          })
        })
      } catch (error) {
        console.error('Error joining presentation:', error);
        socket.emit(SOCKET_EVENTS.ERROR, { message: 'Server error.' });
      }
    })

    socket.on(SOCKET_EVENTS.LEAVE_PRESENTATION, async ({ presentationId, userId }: UserLeavePresentationPayload) => {
      console.log('User left presentation:', presentationId, userId)
      try {
        let presentation = await getPresentation(presentationId)
        if (!presentation) {
          socket.emit(SOCKET_EVENTS.ERROR, { message: 'Presentation not found.' })
          console.log('Presentation not found:', presentationId)
          return
        }

        const user = await getUserById(userId)
        if (!user) {
          socket.emit(SOCKET_EVENTS.ERROR, { message: 'User not found.' })
          console.log('User not found:', userId)
          return
        }

        const userRole = presentation.users.find((u) => u.user.id === user.id)
        if (!userRole) {
          socket.emit(SOCKET_EVENTS.ERROR, { message: 'User is not in the presentation.' })
          console.log('User is not in the presentation:', user.id)
          return
        }

        presentation.users.pull(userRole)
        presentation = await presentation.save()

        // Notify all users in the presentation about the user leaving
        io.to(presentationId).emit(SOCKET_EVENTS.USER_LEFT, {
          presentation: await presentation.populate({
            path: 'users',
            populate: { path: 'user' }
          })
        })
      } catch (error) {
        console.error('Error leaving presentation:', error)
        socket.emit(SOCKET_EVENTS.ERROR, { message: 'Server error.' })
      }
    })

    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      console.log('User disconnected:', socket.id)
    })
  })
}
