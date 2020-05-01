const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = require('../config/authConfig');

class UserModel {
    constructor(db) {
        this.db = db;
    }

    async getUserDb(id) {

        let user = await this.db.findOne({
            where: { id: id }
        });

        if (!user)
            return false;

        return user;
    }

    register(newUser, res) {

        bcrypt.hash(newUser.password, 10)
            .then((hashPassword) => {

                this.db.create({
                    name: newUser.name,
                    email: newUser.email,
                    login: newUser.login,
                    password: hashPassword
                }).then((user) => {
                    user.password = undefined;

                    res.status(200).json({ user, sucesso: true, token: this.generateToken(user.id), message: " Usuário cadastrado!" });

                }).catch((error) => {
                    res.status(400).json({ error, sucesso: false, message: "Erro ao cadastrar usuario", });
                });

            })
            .catch((error) => {
                res.status(400).json({ error, sucesso: false, message: "Erro com o Banco", })
            });

    }

    generateToken(id) {
        return jwt.sign({ id: id }, secret(), { expiresIn: 604800, });
    }

    edit(id, newInfo) {
        return new Promise((resolve, reject) => {

            if (newInfo.password) {
                bcrypt.hash(newInfo.password, 10)
                    .then(hashPassword => {
                        newInfo.password = hashPassword;

                        this.db.update({ ...newInfo }, {
                            where: {
                                id: id,
                            }
                        }).then(response => {

                            if (response[0] == 0) {
                                reject("Erro ao modicar Usuario no banco")
                            } else {
                                this.db.findOne({
                                    where: { id: id }
                                }).then(userResponse => {
                                    userResponse.password = undefined;
                                    resolve(userResponse);
                                })
                            }
                        })
                    })
            } else {
                this.db.update({ ...newInfo }, {
                    where: {
                        id: id,
                    }
                })
                    .then(response => {
                        if (response[0] == 0) {
                            reject("Erro ao modicar Usuario no banco")
                        } else {
                            this.db.findOne({
                                where: { id: id }
                            }).then(userResponse => {
                                userResponse.password = undefined;
                                resolve(userResponse);
                            })
                        }
                    })


            }
        })


    }

    getMultiUser(userSearch) {
        return new Promise((resolve, reject) => {

            let idsUsers = userSearch.map(element => { return element.fkUser });

            this.db.findAll({
                where: { id: idsUsers }
            })
                .then(users => {
                    users.map(element => {
                        element.password = undefined;

                        userSearch.map(index =>{
                            if(element.id === index.fkUser)
                                element.dataValues.typeUser = index.typeUser;

                        })
                    });
                    
                    resolve(users);
                })
                .catch(error => {
                    let newError = { error, success: false, message: `erro ao retornar usuarios` }
                    reject(newError);
                })
        })
    }
}

module.exports = UserModel;