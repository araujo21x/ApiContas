const UserController = require('../controller/UserController');
const userController = new UserController;

module.exports = (app)=>{

    app.post(userController.rotas().register, userController.registerUser());

}