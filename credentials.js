import { v4 as uuidv4 } from 'uuid'
import sql from './mysql.js'
import fs from 'fs'
import path from 'path'

const __dirname = path.resolve(path.dirname(''))

const root = path.join(__dirname, 'public')

export function ValidateRegisterCredentials(req, res) {
    const name = req.body.name;
    const email = req.body.email
    const password = req.body.password
    let value = { success: false }

    sql.query(`SELECT email FROM user WHERE email="${email}"`, (sqlErr, sqlRes) => { 
        if (sqlErr) {
            res.send(JSON.stringify(value))
            throw sqlErr
        }
        if (sqlRes.length > 0) {
            value.reason = "Email is already used"
            res.send(JSON.stringify(value))
        } else {
            const uuid = uuidv4()
            sql.query(`INSERT INTO user VALUES("${name}", "${email}", "${password}", "${uuid}", "default.png")` , (sqlErr, sqlRes) => {
                if (sqlErr) {
                    res.send(JSON.stringify(value))
                    throw sqlErr
                }
                fs.mkdir(`${root}/users/${uuid}`, (err) => {
                    if (err) throw err
                    fs.copyFile(`${root}/default.png`,
                                `${root}/users/${uuid}/default.png`,
                                err => { if (err) throw err })
                })
                value.success = true
                value.data = {
                    name: name,
                    email: email,
                    uuid: uuid
                }
                res.send(JSON.stringify(value))
            })
        }
    })
}

export function ValidateLoginCredentials(req, res) {
    const email = req.body.email
    const password = req.body.password
    let value = { success: false }

    sql.query(`SELECT * FROM user WHERE email="${email}"`, (sqlErr, sqlRes) => {
        if (sqlErr) {
            res.send(JSON.stringify(value))
            throw sqlErr
        }
        if (sqlRes.length == 0 || sqlRes[0].password != password) {
            value.reason = "Bad Credentials"
            res.send(JSON.stringify(value))
        } else {
            value.success = true
            value.data = {
                name: sqlRes[0].name,
                email: sqlRes[0].email,
                uuid: sqlRes[0].uuid
            }
            res.send(JSON.stringify(value))
        }
    })
}