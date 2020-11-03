const Sequelize = require('sequelize');
const connection = require('../database/database');
const Category = require('../categories/Category');

const Article = connection.define('articles', {
    title: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false,
    }
})

//Relationship between databases
Category.hasMany(Article); //1-M => 1 category has many articles
Article.belongsTo(Category); //1-1 => 1 article belongs to 1 category

module.exports = Article;