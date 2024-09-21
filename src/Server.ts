import express, { Express } from "express"
import cors from "cors"
import dbConnection from "./db/config"
import userRouter from "./routes/users"
import presentationRouter from "./routes/presentations"
import { notFound } from "./controllers/404"
import { ApiPaths } from "./interfaces/utils"


export class Server {
  private app: Express
  private port: number
  private paths: ApiPaths
  private basePath: string

  constructor() {
    this.basePath = "/api/v1"
    this.port = parseInt(process.env.PORT || "3000")
    this.app = express()
    this.paths = {
      users: "/users",
      presentations: "/presentations",
    }
    this.connectDB()
    this.middlwares()
    this.routes()
  }

  connectDB() {
    if (process.env.NODE_ENV !== 'test') {
      dbConnection()
    }
  }

  middlwares() {
    this.app.use(cors())
    this.app.use(express.static('public'))
    this.app.use(express.json())
  }

  routes() {
    this.app.use(`${this.basePath}${this.paths.users}`, userRouter)
    this.app.use(`${this.basePath}${this.paths.presentations}`, presentationRouter)
    this.app.get('*', notFound)
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`[server]: Server is running at port ${this.port}`)
    })
  }
}