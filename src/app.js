import express from 'express'
import userController from './controllers - outdated/userController'
import bodyParser from 'body-parser'
import cors from 'cors'
import awsController from './controllers - outdated/awsController'

const app = express()
// Middlewares
app.use(bodyParser.urlencoded({ extended: false }))
app.use('*', cors())

export default app