const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
//const path = require("path");

const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");

const Article = require("./articles/Article");
const Category = require("./categories/Category");
// view engine

app.set('view engine', 'ejs'); 
//app.set('views', path.join(__dirname, 'views'));


// static
app.use(express.static('public'));

// body-parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// database conecttion
connection
    .authenticate()
    .then(()=> {
        console.log("Conexão feita com sucesso!")
    }).catch((error) =>{
        console.log(error);
    })


// Controllers
app.use("/", categoriesController);
app.use("/", articlesController);


app.get("/", (req, res) =>{
    res.render("index");
})

app.listen(8080, ()=>{
    console.log("o servidor está rodando na url: http://localhost:8080!")
})