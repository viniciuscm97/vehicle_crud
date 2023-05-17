import express from 'express'

const server = express()

server.use(express.json())

import {routes} from "./routes"

server.use(routes)

server.listen(3000, () => console.log("Server is running! :D"))