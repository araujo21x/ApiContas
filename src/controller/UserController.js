const { Op } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = require('../config/authConfig');

class UserController {

    rotas() {
        return {
            register: '/registerUser',
            login: '/login',
        }
    }

    registerUser() {
        return (req, res) => {
            const db = sequelize.models.User;

            db.findAll({
                where: {
                    [Op.or]: [
                        { login: req.body.login },
                        { email: req.body.email }
                    ]
                }
            })
                .then((value) => {

                    if (value.length === 0) {

                        bcrypt.hash(req.body.password, 10)
                            .then((hashPassword) => {

                                db.create({
                                    name: req.body.name,
                                    email: req.body.email,
                                    login: req.body.login,
                                    password: hashPassword,
                                }).then((user) => {
                                    user.password = undefined;

                                    res.status(200).json({
                                        user,
                                        token: this.generateToken(user.id)
                                    });

                                }).catch((error) => {
                                    res.status(400).json({ error });
                                });

                            })
                            .catch((error) => {
                                res.status(400).json({ error })
                            });

                    } else {

                        let error = {
                            email: undefined,
                            login: undefined,
                        };

                        value.forEach(item => {
                            if (req.body.email === item.email)
                                error.email = "Já cadastrado";

                            if (req.body.login === item.login)
                                error.login = "já Cadastrado";
                        });

                        res.status(400).json({ error });

                    }

                })
                .catch((error) => {
                    res.status(400).json({ error });
                });

        }
    }

    login() {
        return (req, res) => {
            const db = sequelize.models.User;

            db.findOne({
                where: {
                    login: req.body.login
                }
            }).then((user) => {
                if (!user) {
                    res.status(200).json({ user });
                } else {
                    bcrypt.compare(req.body.password, user.password)
                        .then((success) => {
                            if (!success) {
                                res.status(400).json({ error: "Usuário não cadastrado!" });
                            } else {
                                user.password = undefined;

                                res.status(200).json({
                                    user,
                                    token: this.generateToken(user.id)
                                });
                            }
                        })
                        .catch((error) => {
                            res.status(400).json({ error });
                        })
                }

            }).catch((error) => {
                res.status(400).json({ error });
            })
        }
    }

    generateToken(id) {
        return jwt.sign({ id: id }, secret(), { expiresIn: 604800, });
    }
}

module.exports = UserController;