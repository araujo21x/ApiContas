const UserController = require('../controller/UserController');
const userControlle = new UserController();

module.exports = (app) => {
    userRoutes = userControlle.rotas();
    
    app.get('/', (req, res) => {
        res.send({id: req.userId });
    });
}