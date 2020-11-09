const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");

//Controllers
const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const usersController = require("./users/usersController");

//Models
const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./users/User");

//View Engine
app.set("view engine", "ejs");

//Body-Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Static
app.use(express.static("public"));

//Database
connection
  .authenticate()
  .then(() => {
    console.log("Conexão realizada c/ sucesso.");
  })
  .catch((error) => {
    console.log(error);
  });

//Controllers and Rotes
app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);

app.get("/", (req, res) => {
  Article.findAll({
    include: [{ model: Category }],
    order: [["id", "DESC"]],
    limit: 4
  }).then((articles) => {
    Category.findAll().then((categories) => {
      res.render("index", { articles: articles, categories: categories });
    });
  });
});

app.get("/:slug", (req, res) => {
  var slug = req.params.slug;

  Article.findOne({
    where: { slug: slug },
  })
    .then((article) => {
      if (article != undefined) {
        Category.findAll().then((categories) => {
          res.render("article", { categories: categories, article: article });
        });
      } else {
        res.redirect("/");
      }
    })
    .catch((err) => {
      res.redirect("/");
    });
});

app.get("/category/:slug", (req, res) => {
  var slug = req.params.slug;

  Category.findOne({
    where: { slug: slug },
    include: [{ model: Article }],
  })
    .then((category) => {
      if (category != undefined) {
        Category.findAll().then((categories) => {
          res.render("index", {
            articles: category.articles,
            categories: categories,
          });
        });
      } else {
        res.send("vish deu merda");
      }
    })
    .catch((err) => {
      console.log("deu merda");
    });
});

//Server on
app.listen(8080, () => {
  console.log("Servidor ligado com sucesso.");
});
