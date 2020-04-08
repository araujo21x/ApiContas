const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('conta','lucas','9103',{ 
        dialect: 'postgres',
});
module.exports = sequelize;
