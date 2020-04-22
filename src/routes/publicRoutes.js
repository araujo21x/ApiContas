const UserController = require('../controller/UserController');
const userController = new UserController;

module.exports = (app)=>{
    const userRotas = userController.routes();

    app.post(userRotas.register, userController.registerUser());
    app.post(userRotas.login, userController.login());
}       