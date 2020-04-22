const UserController = require('../controller/UserController');
const userControlle = new UserController();

module.exports = (app) => {
    const userRoutes = userControlle.routes();

    app.route(userRoutes.user)
        .get(userControlle.getUser())
        .delete(userControlle.deleteUser())
        .patch(userControlle.editUser());

}