# User Dashboard Backend

### Steps to run the project
1. Clone the repository
2. Run `npm install` to install all the dependencies
3. Create __.env__ file in the root directory and add the following environment variables, you can use the __.env-example__ file as a reference and replace the values with your own
    - PORT=3000
    - MONGO_URL=your_mongo_db_url
4. Run `npm run dev` to start the development server

### Base URL
`http://localhost:3000/api/v1`

### API Endpoints
2. POST `/users` - Register user with nickname
3. POST `/presentations` - Create a new presentation
4. GET `/presentations` - Get all presentations (params: `limit`, `page`, `orderBy`, `orderDirection`)
5. GET `/presentations/:id` - Get presentation by id

__Note:__ Check the file `src/interfaces/events.ts` for the list of events that can be emitted by and received from socket.io. The actions for socket.io are defined in the `src/socket/index.ts` file.

Frontend repository can be found [here](https://github.com/gerashdo/collaborative-presentations-front)
