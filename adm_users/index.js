var express = require('express')
var app = express()
var bodyParse = require('body-parser')
var router = require('./routes/routes')

var cors = require("cors")
app.use(cors())

// Body-Parse
app.use(bodyParse.urlencoded({extended: false}))
app.use(bodyParse.json())


app.use('/', router)


app.listen(2000, () => {
    console.log('Servidor rodando')
});