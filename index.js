const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');

//Controllers
const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController');

//Models
const Article = require('./articles/Article')
const Category = require('./categories/Category')

//View Engine
app.set('view engine', 'ejs')

//Body-Parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//Static
app.use(express.static('public'))

//Database
connection
    .authenticate()
    .then(() => {
        console.log('Conexão realizada c/ sucesso.')
    }).catch((error) => {
        console.log(error)
    })

//Rotes & Controllers
app.use("/", categoriesController)
app.use("/", articlesController)

app.get("/", (req, res) => {
    res.render('index')
})

//Server on
app.listen(8080, () => {
    console.log('Servidor ligado com sucesso.')
})