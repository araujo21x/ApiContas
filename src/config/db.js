const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('banco','user','senha',{ 
        dialect: 'postgres',
});
module.exports = sequelize;
