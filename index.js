//const log = require('./logger');
const config = require('config');
const express = require('express')
const helmet = require('helmet');
const morgan = require('morgan');
const Joi = require('joi');
const pug = require('pug');
const stratupDebug = require('debug')('app:startup');
const dbDubug = require('debug')('app:db');
const app = express()
const port = 3000

//Midllewares
app.use(helmet());

if(app.get('env') === 'development') {
    app.use(morgan('tiny'));
    stratupDebug('morgan enabled...');
}

//db work...
dbDubug('connected to database...');

app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'pug');
app.set('views', './views');
//app.use(log())

console.log(`name: ${config.get('name')}`);

//Personnaliser un middleware 2
app.use((req, res, next) => {
    console.log('Authenticating...');
    next();
})

const courses = [
    {id : 1, name: "Laravel"},
    {id : 2, name: "JAVA EE"},
    {id : 3, name: "Angular"},
    {id : 4, name: "NodeJS"},
];

app.get('/', (req, res) => {
    res.render('index', {
        myTitle: "Atos formation",
        myMessage: "Formation sur NodeJS",
        myDescription: "This is a course of nodejs"
    })
})

app.get('/api/courses', (req, res) => {
   //res.send(courses);
   res.render('course/index', {
       courses: courses
   });
})

app.get('/api/courses/:id', (req, res) => {
   const myId = req.params.id;
   res.send(courses.find((course) => course.id == myId));
})

app.post('/api/courses', (req, res) => {
    
    const schema = {
        name: Joi.string().min(3).required()
    }

    const result = Joi.validate(req.body, schema);
    
    
    
    if(result.error) {
        stratupDebug(result.error);
       return res.status(400).send(result.error.details[0].message);
    }

    course = {
        id: courses.length + 1,
        name: req.body.name
    }
   //courses.unshift(course);
    courses.push(course);
    res.send(courses);

   
})

app.put('/api/courses/:id', (req, res) => {
   console.log('name: ', req.body.name);
   const course = courses.find((course) => course.id === +req.params.id);
   course.name = req.body.name;
   
   res.send(courses);
})

app.delete('/api/courses/:cours', (req, res) => {
    
    const course = req.params.cours;

    // retourner index de l'element
    const index = courses.indexOf(course);
   
    // Supprimer
    courses.splice(index, 1);

    res.send(courses);
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))