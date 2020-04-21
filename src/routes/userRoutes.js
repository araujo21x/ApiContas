const UserController = require('../controller/UserController');
const userControlle = new UserController();

module.exports = (app) => {
    const userRoutes = userControlle.routes();
    
    app.delete(userRoutes.delete , userControlle.deleteUser());

}