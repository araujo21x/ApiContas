const { Op } = require('sequelize');

const sequelize = require('../config/db');
const ExpenseAndGroupController = require('./ExpenseAndGroupController');
const UserGroupController = require('./UserGroupController');
const UserModel = require('../model/UserModel');

class ExpenseController {

    routes() {
        return {
            expense: "/expense",
            ExpenseGroup: "/getExpenseGroup",
            expenseAll: "/getAllExpenses"
        };
    }

    register() {
        return (req, res) => {
            let expenseGroupCont = new ExpenseAndGroupController;
            expenseGroupCont.searchExistence(req.body.idGroup, req.body.belongDate)
                .then(idExpenseGroup => {
                    let db = sequelize.models.Expense;

                    db.create({
                        fkCreateUser: req.userId,
                        fkExpenseAndGroup: idExpenseGroup,
                        debtors: req.body.debtors,
                        typeSpent: req.body.typeSpent,
                        amount: req.body.amount,
                        valueIndividual: this.valueIndividual(req.body.amount, req.body.debtors),
                        description: req.body.description,
                        belongDate: req.body.belongDate,
                    })
                        .then(Expense => { res.status(200).json(Expense) })
                        .catch(error => { res.status(400).json({ error, success: false, message: `Erro ao salvar expense no banco` }) });

                })
                .catch(error => { res.status(400).json(error) })
        }
    }

    getAllExpenses() {
        return (req, res) => {
            let db = sequelize.models.Expense;

            db.findAll({
                where: { fkExpenseAndGroup: req.body.idExpenseAndGroup }
            }).then(expenses => {

                let userGroupController = new UserGroupController;
                let dbUser = sequelize.models.User;

                let userModel = new UserModel(dbUser);

                userGroupController.getUsersForGroup(req.body.idGroup)
                    .then(userSearch => {
                        userModel.getMultiUser(userSearch)
                            .then(users => {
                                let response = this.expesesAndUser(expenses, users);
                                res.status(200).json({ response, expenses });
                            })
                            .catch(error => {
                                console.log(error)
                                res.status(400).json({ error })
                            });
                    })
                    .catch(error => { res.status(400).json(error) });

            })
                .catch(error => {
                    res.status(400).json(error);
                })
        }
    }

    edit() {
        return (req, res) => {
            let expenseGroupCont = new ExpenseAndGroupController;
            expenseGroupCont.searchExistence(req.body.idGroup, req.body.belongDate)
                .then(idExpenseGroup => {
                    let db = sequelize.models.Expense;

                    db.update({
                        fkCreateUser: req.userId,
                        fkExpenseAndGroup: idExpenseGroup,
                        debtors: req.body.debtors,
                        typeSpent: req.body.typeSpent,
                        amount: req.body.amount,
                        valueIndividual: this.valueIndividual(req.body.amount, req.body.debtors),
                        description: req.body.description,
                        belongDate: req.body.belongDate,
                    }, { where: { id: req.body.id } })
                        .then(() => {
                            this.getExpense()(req, res);
                        })
                        .catch(error => { res.status(400).json(error) });

                })
        }
    }

    remove() {
        return (req, res) => {
            let db = sequelize.models.Expense;

            db.destroy({ where: { id: req.body.id } })
                .then(response => {
                    if(response === 0)
                        res.status(200).json({message:`Usuário não existe`});
                    
                    res.status(200).json({message:`Usuário Apagado`});
                })
                .catch(error => { res.status(400).json(error)});
        }
    }

    getExpense() {
        return (req, res) => {
            let db = sequelize.models.Expense;

            db.findOne({ where: { id: req.body.id } })
                .then(expense => { res.status(200).json(expense) })
                .catch(error => { res.status(200).json(error) });
        }
    }

    valueIndividual(amount, debtors) {
        return parseFloat(amount / (debtors.length));
    }

    expesesAndUser(expenses, users) {
        users.map(user => {
            let amount = 0;

            expenses.map(expense => {
                expense.debtors.map(debtor => {
                    if (user.id === debtor)
                        amount = amount + expense.valueIndividual;
                });
            });

            user.dataValues.amount = amount;
        });

        return users;
    }
}

module.exports = ExpenseController;