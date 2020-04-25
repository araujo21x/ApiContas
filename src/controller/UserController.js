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
            user: '/user',
        }
    }

    registerUser() {
        return (req, res) => {
            let db = sequelize.models.User;
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
                            email: false,
                            login: false,
                        };

                        value.forEach(item => {
                            if (req.body.email === item.email)
                                error.email = "Já cadastrado";

                            if (req.body.login === item.login)
                                error.login = "já Cadastrado";
                        });

                        res.status(400).json({ error, sucesso: false, message: "Login ou Email Cadastrado", });

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
                    res.status(400).json({ sucesso: false, message: 'Login não encontrado!' });
                } else {

                    bcrypt.compare(req.body.password, user.password)
                        .then((success) => {
                            if (!success) {
                                console.log(success);
                                res.status(400).json({ sucesso: false, message: 'Senha Inválida!' });
                            } else {
                                user.password = undefined;
                                res.status(200).json({ user, token: this.generateToken(user.id) });
                            }
                        })
                        .catch((error) => {
                            res.status(400).json({ sucesso: false, message: error });
                        })

                }

            }).catch((error) => {
                res.status(400).json({ sucesso: false, message: error });
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
                .then(response => {
                    res.status(200).json({ success: true, message: "Usuario apagado com sucesso" });
                })
                .catch(error => {
                    res.status(400).json({ error, message: "Erro!!!" });
                })


        }

    }

    getUser() {
        return (req, res) => {
            let db = sequelize.models.User;
            let userModel = new UserModel(db);
            let user = userModel.getUserDb(req.userId);

            if (!user)
                res.status(400).json({ sucesso: false, message: 'Erro ao encontrar usuário!' });

            res.status(200).json({ user, sucesso: true, message: "Usuário encontrado!", });
        }
    }

    editUser() {
        return (req, res) => {
            let db = sequelize.models.User;

            db.findAll({
                where: {
                    [Op.or]: [
                        { login: req.body.login },
                        { email: req.body.email }
                    ]
                }
            }).then(user => {

                let verificationId = user.filter(element => {
                    return element.id !== req.userId
                });

                console.log(verificationId);
                if (verificationId.length > 0) {

                    let error = {
                        email: false,
                        login: false,
                    }

                    user.map(value => {
                        if (value.login === req.body.login && value.id !== req.userId)
                            error.login = "Login já cadastrado";

                        if (value.email === req.body.email && value.id !== req.userId)
                            error.email = "Email já cadastrado"
                    });

                    res.status(400).json({ success: false, error, message: "Email ou Login já cadastrado" })
                } else {

                    let userModel = new UserModel(db);
                    userModel.edit(req.userId, req.body)
                        .then(response => {
                            res.status(200).json({ success: true, user: response, message: "Usuario modificado com sucesso!" });
                        })
                        .catch(error=>{
                            res.status(400).json({ success: false, error});
                        });

                }

            })

        }
    }

    generateToken(id) {
        return jwt.sign({ id: id }, secret(), { expiresIn: 604800, });
    }

}

module.exports = UserController;