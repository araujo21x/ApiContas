const UserDao = require('../models/UserDao');
const { Op } = require('sequelize');
const sequelize = require('../../config/db');

class UserController {

    rotas() {
        return{
            register: '/registerUser',
            login: '/login',
        }
    }

    registerUser() {
        return(req, res) => {
            const User = sequelize.models.User;
            const userDao = new UserDao(User);
            const err = [];

            if (req.body.email !== req.body.reEmail) {
                err.push('Emails diferentes');
            }

            if (req.body.password !== req.body.rePassword) {
                err.push('Senhas diferentes');
            }

            if (err.length === 0) {
                User.findAll({
                    where: {
                        [Op.or]: [
                            { login: req.body.login },
                            { email: req.body.email }
                        ]
                    }
                })
                    .then((value) => {

                        value.forEach(element => {
                            if (element.dataValues.login === req.body.login) {
                                err.push('Login já cadastrado');
                            }

                            if (element.dataValues.email === req.body.email) {
                                err.push('Email já cadastrado');
                            }

                        });

                        if (err.length === 0) {
                            userDao.register(req.body, res);
                        } else {
                            res.json(err);
                        }

                    })
                    .catch(() => {
                        userDao.register(req.body, res);
                    });
            } else {
                res.json(err);
            }
        }
    }

    login() {
        return(req, res) => {
            
        }
    }
}

module.exports = UserController;