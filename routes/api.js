const express = require('express')
const db = require('../database')
const router = express.Router()

// *** API Books *** //

router.get('/books', (req, res) => {
    db.query("SELECT * FROM books", (err, rows) => {
        if(err) throw err
        res.render(rows)
    })
})

router.get('/books/:id', (req, res) => {
    db.query("SELECT * FROM books WHERE book_id = " + req.params.id, (err, rows) => {
        if(err) throw err

        if(rows.length != 0) {
            res.send(rows)
        } else {
            res.sendStatus(404)
        }
    })
})

router.get('/books/course/:id', (req, res) => {
    db.query("SELECT * FROM books WHERE book_id in (SELECT book_id FROM book_courses WHERE course_id = " + req.params.id + ")", (err, rows) => {
        if(err) throw err
        res.send(rows)
    })
})
router.post('/books', (req, res) => {
    let title = req.body.bookTitle
    let price = req.body.bookPrice
    let query = "INSERT INTO books (title, price) VALUES ('"+title+"', '"+price+"')"
    db.query(query, (err, rows) => {
        if(err) throw err
        res.status(201).send("Thanks!")
    })
})

router.delete('/books/:id', (req, res) => {
    db.query("DELETE FROM books WHERE book_id =" + req.params.id, (err, rows) => {
        if(err) throw err
        if(rows.changedRows != 0) {
            res.status(204).send('Deleted!')
        } else {
            res.status(404).send('Book does not exist')
        }
    })
})

// *** API Courses *** //

router.get('/departments/', (req, res) => {
    db.query("SELECT * FROM departments ORDER BY department ASC", (err, rows) => {
        if(err) throw err
        let data = rows.map(row => {
            return {
                id: row.department_id,
                name: row.department
            }
        })
        res.send(data)
    })
})

router.get('/departments/:id/courses', (req, res) => {
    if(req.params.id != 'undefined') {
        db.query("SELECT course_id, course FROM courses WHERE department_id=" + req.params.id, (err, rows) => {
            if(err) throw err
            let data = rows.map(row => {
                return {
                    id: row.course_id,
                    code: row.course
                }
            })
            res.send(data)
        })
    } else {
        res.send([])
    }
})

router.get('/courses', (req, res) => {
    db.query("SELECT course_id, course FROM courses", (err, rows) => {
        if(err) throw err
        res.send(rows)
    })
})

router.get('/courses/:id', (req, res) => {
    db.query("SELECT * FROM books INNER JOIN book_courses ON books.book_id = book_courses.book_id WHERE course_id =" + req.params.id, (err, rows) => {
        if(err) throw err
        let data = rows.map(row => {
            return {
                id: row.book_id,
                title: row.title,
                price: row.price,
            }
        })
        res.send(data)
    })
})
    

module.exports = router