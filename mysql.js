import mysql from 'mysql'

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'burokamerad'
})

connection.connect(error => {
    if (error) throw error
    console.log("Connected to DATABASE")
})

export default connection