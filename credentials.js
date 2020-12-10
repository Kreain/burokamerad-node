import sql from './mysql.js'
import { v4 as uuidv4 } from 'uuid'

export function ValidateRegisterCredentials(credentials) {
    const name = credentials.name;
    const email = credentials.email
    const password = credentials.password
    const confirm = credentials.confirmPassword

    if (password !== confirm)
        return ({ success: false, reason: "Passwords do not match"})
    sql.query(`SELECT email FROM user WHERE email="${email}"`, (err, res) => { 
        if (err) {
            console.error(err)
            return ({ success: false })
        }
        if (res.length) {
            console.log("here")
            return ({ success: false, reason: "Email is already used"})
        }
        const uuid = uuidv4()
        sql.query(`INSERT INTO user VALUES("${name}", "${email}", "${password}", "${uuid}")`, (err, res) => {
            if (err) {
                console.error(err)
                return ({ success: false })
            }
            console.log("hello")
            return ({ success: true, data: { name: name, email: email, uuid: uuid }})
        })
    })
}