const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = require('../config/authConfig');

class UserModel {
    constructor(db) {
        this.db = db;
    }

    register(newUser, res) {

        bcrypt.hash(newUser.password, 10)
            .then((hashPassword) => {

                this.db.create({
                    name: newUser.name,
                    email: newUser.email,
                    login: newUser.login,
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
    
    }

    generateToken(id) {
        return jwt.sign({ id: id }, secret(), { expiresIn: 604800, });
    }

}

module.exports = UserModel;