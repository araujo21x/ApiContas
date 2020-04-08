const express = require('express');
const routes = require('../src/routes/routes');
const sequelize = require('./db');
const createTables = require('./tableConfig');
const bodyParser = require('body-parser');

module.exports = ()=>{
    const app = express();

    sequelize.authenticate()
    .then(()=>{
        console.log('conetou tudo ok');
        createTables();
    })
    .catch(()=>{
        console.log('deu ruim!');
    });

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    routes(app);

    return app;
};