const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const secret = require('../config/authConfig');
const sequelize = require('../config/db');
const UserModel = require('../model/UserModel');

class UserController {

    routes() {
        return {
            register: '/registerUser',
            login: '/login',
            delete: '/deleteUser',

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
                        const user = new UserModel(db);

                        user.register(req.body, res);

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
                    res.status(200).json({ error: "login não errado!" });
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

    deleteUser() {

        return (req, res) => {
            const db = sequelize.models.User;

            console.log(req.userId);

            db.destroy({
                where: {
                    id: req.userId,
                }
            })
                .then(success => {
                    res.status(200).json({ success, message: "Usuario apagado com sucesso" });
                })
                .catch(error => {
                    res.status(400).json({ error, message: "Erro!!!" });
                })


        }

    }

    getUser(){
        return(req, res) => {
            const db = sequelize.models.User;

            db.findOne({
                where:{
                    id: req.userId,
                }
            })
                .then(user =>{
                    console.log(user);
                    res.status(200).json({user, message: "ususario encontrado com sucesso"});
                })
                .catch(error =>{
                    res.status(400).json({error});
                });
        }
        
    }

    generateToken(id) {
        return jwt.sign({ id: id }, secret(), { expiresIn: 604800, });
    }

}

module.exports = UserController;