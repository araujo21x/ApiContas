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

        if(!user)
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

    async edit(id, newInfo){

        let response = await this.db.update({...newInfo},{
            where: {
                id: id,
            }
        });

        console.log(response[0]);

    }
}

module.exports = UserModel;