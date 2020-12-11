import { v4 as uuidv4 } from 'uuid'
import sql from './mysql.js'

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
            sql.query(`INSERT INTO user VALUES("${name}", "${email}", "${password}", "${uuid}")` , (sqlErr, sqlRes) => {
                if (sqlErr) {
                    res.send(JSON.stringify(value))
                    throw sqlErr
                }
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