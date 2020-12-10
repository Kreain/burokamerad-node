import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { ValidateRegisterCredentials } from './credentials.js'

const App = express()

App.use(cors())
App.use(bodyParser.urlencoded({ extended: true }))
App.use(bodyParser.json())

// App.post('/login', (req, res) => {
//     const valid = false;
//     if (req.body != undefined)
//         valid = ValidateLoginCredentials(req.body)
//     res.send(JSON.stringify({ success: valid }))
// })

App.post('/register', (req, res) => {
    let response = undefined;

    if (req.body != undefined && req.body.name != undefined
        && req.body.email != undefined && req.body.password != undefined
        && req.body.confirmPassword != undefined) {
            response = ValidateRegisterCredentials(req.body);       
            res.send(JSON.stringify((response == undefined) ? { success: false } : response))
            console.log(response)
    } else {
        res.send(JSON.stringify({ success: false }))
    }
})

App.listen(7852, "localhost", () => {
    console.log("Server listening on port 7852")
})