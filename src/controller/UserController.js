const sequelize = require('../../config/db');
const UserDao = require('../models/UserDao');

class UserController{
    
    rotas(){
        return {
            register: '/registerUser',
        }
    }

    registerUser(){
        return (req, res)=> {
            const userDao = new UserDao(sequelize.getQueryInterface());
            userDao.register(req.body);
        }
        

    }

}

module.exports = UserController;