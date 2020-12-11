import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import path from 'path'
import fs from 'fs'
import multer from 'multer'
import { ValidateRegisterCredentials, ValidateLoginCredentials } from './credentials.js'

const App = express()
const __dirname = path.resolve(path.dirname(''))
const options = {
    root: path.join(__dirname, 'public')
}

App.use(cors())
App.use(bodyParser.urlencoded({ extended: true }))
App.use(bodyParser.json())
App.use(express.static(__dirname + '/public'))

const upload = multer({ dest: './public/' });

App.get('/image/:uuid', (req, res) => {
    if (!fs.existsSync(`${options.root}/users/${req.params.uuid}`))
        res.sendFile("null.png", options)
    else
        res.sendFile(`/users/${req.params.uuid}/default.png`, options)
})

App.post('/upload/:uuid', upload.single('hologram'), (req, res) => {
    console.log(req.file)
    res.send(JSON.stringify({ success: true }))
})

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