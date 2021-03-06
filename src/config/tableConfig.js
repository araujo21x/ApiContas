const sequelize = require('./db');
const { DataTypes } = require('sequelize');

module.exports = () => {

    const User = sequelize.define('User', {
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
        }
    });
    
    const Group = sequelize.define('Group', {
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
    });
    
    const UserAndGroup = sequelize.define('UserAndGroup', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        typeUser:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        fkUser: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        fkGroup: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Groups',
                key: 'id'
            },
            onUpdate: 'cascade',
            onDelete: 'cascade',
        },
    });

    const Expense = sequelize.define('Expense', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        fkCreateUser: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Users',
                key: 'id'
            },
        },
        fkExpenseAndGroup: {
            type: DataTypes.INTEGER,
            references: {
                model: 'ExpenseAndGroups',
                key: 'id'
            },
        },
        debtors:{
            type: DataTypes.ARRAY(DataTypes.INTEGER),
            allowNull: false,
        },
        typeSpent: {
            type: DataTypes.STRING
        },
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        valueIndividual : {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
        },
        belongDate: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    const ExpenseAndGroup = sequelize.define('ExpenseAndGroup', { 
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        fkGroup:{
            type: DataTypes.INTEGER,
            references: {
                model: 'Groups',
                key: 'id'
            },
            onDelete: 'cascade',
        }
    });

    sequelize.sync({ alter: true })
        .then((result) => {
            console.log("Sucesso!!!");
        })
        .catch((err) => {
            console.log(err);
        });

}