import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { ValidateRegisterCredentials, ValidateLoginCredentials } from './credentials.js'

const App = express()

App.use(cors())
App.use(bodyParser.urlencoded({ extended: true }))
App.use(bodyParser.json())

App.post('/login', (req, res) => {
    if (req.body != undefined && req.body.email != undefined
        && req.body.password != undefined)
            ValidateLoginCredentials(req, res)
    else
        res.send(JSON.stringify({ success: false }))
})

App.post('/register', (req, res) => {
    if (req.body != undefined && req.body.name != undefined
        && req.body.email != undefined && req.body.password != undefined
        && req.body.confirmPassword != undefined)
            ValidateRegisterCredentials(req, res)
    else
        res.send(JSON.stringify({ success: false }))
})

App.listen(7852, "localhost", () => {
    console.log("Server listening on port 7852")
})