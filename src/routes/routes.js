const UserController = require('../controller/UserController');
const userController = new UserController;

module.exports = (app)=>{

    app.post(userController.rotas().register, userController.registerUser());
    app.post(userController.rotas().login, userController.login());
    
}