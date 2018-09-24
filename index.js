const express = require('express')
const app = express()
const port = 3000

app.use(express.json())

const courses = [{id: 1, name: 'Laravel'}, {id: 34, name: 'Angular'}, {id: 12, name: 'NodeJS'}];

app.get('/api/courses', (req, res) => {
   res.send(courses);
})

app.get('/api/courses/:id', (req, res) => {
   const myId = req.params.id;
   res.send(courses.find((course) => course.id == myId));
})

app.post('/api/courses', (req, res) => {
    
    course = {
        id: req.body.id,
        name: req.body.name
    }
   //courses.unshift(course);
    courses.push(course);
    res.send(courses);
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))