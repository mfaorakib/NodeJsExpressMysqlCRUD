var express = require('express')
var cors = require('cors')
var app = express()
app.use(express.urlencoded({extended: true})); 
app.use(express.json()); 
const mysql = require('mysql') 
app.use(cors())

const pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : '',
    password        : '',
    database        : 'test'
})

app.get('', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('connected as id ' + connection.threadId)
        connection.query('SELECT * FROM test.students', (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

            // if(err) throw err
            console.log('The data from students table are: \n', rows)
        })
    })
})
// Get an Students 
app.get('/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        connection.query('SELECT * FROM test.students WHERE id = ?', [req.params.id], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
            
            console.log('Student table are: \n', rows)
        })
    })
});
 
//Delete the students
app.delete('/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        connection.query('DELETE FROM test.students WHERE id = ?', [req.params.id], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
            
            console.log('Student table are: \n', rows)
        })
    })
});
//Add the students
app.post('', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        
        const params = req.body
        connection.query('INSERT INTO test.students SET ?', params, (err, rows) => {
        connection.release() // return the connection to pool
        if (!err) {
            res.send(`Students with the record ID  has been added.`)
        } else {
            console.log(err)
        }

        console.log('Student Record table are:11 \n', rows)

        })
    })
});
//update students Details 
app.put('', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        const { Id, Name,Description,Father_Name} = req.body

        connection.query('UPDATE test.students SET Name = ? ,Description = ?,Father_Name = ? WHERE Id = ?',
         [Name,Description,Father_Name,Id] , (err, rows) => {
            connection.release() // return the connection to pool

            if(!err) {
                res.send(`Students name: ${Name} has been added.`)
            } else {
                console.log(err)
            }

        })

        console.log(req.body)
    })
})
app.listen(5000, function () {
    console.log('listening on port 5000')
  })