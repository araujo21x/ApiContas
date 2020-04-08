const sequelize = require('./db');
const {DataTypes} = require('sequelize');
const querySql = sequelize.getQueryInterface();

module.exports = () =>{

    querySql.createTable('user', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        login: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        dateRegistry: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    });

    querySql.createTable('group',{
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        dateCreated: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    });

    querySql.createTable('userAndgroup',{
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        fkUser: {
            type: DataTypes.INTEGER,
            references:{
                model: 'user',
                key: 'id'
            },
            onUpdate: 'cascade',
            onDelete: 'cascade',
        },
        fkGroup: {
            type: DataTypes.INTEGER,
            references:{
                model: 'group',
                key: 'id'
            },
            onUpdate: 'cascade',
            onDelete: 'cascade',
        },
    });

    querySql.createTable('account',{
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        fkCreateUser:{
            type: DataTypes.INTEGER,
            references:{
                model: 'user',
                key: 'id'
            },
            onUpdate: 'cascade',
            onDelete: 'cascade',
        },
        fkgroup:{
            type: DataTypes.INTEGER,
            references:{
                model: 'group',
                key: 'id'
            },
            onUpdate: 'cascade',
            onDelete: 'cascade',
        },
        typeSpent: {
            type: DataTypes.STRING
        },
        value: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
        },
        dateRegistry: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        belongDate: {
            type: DataTypes.DATE,
        },
        
    })

}