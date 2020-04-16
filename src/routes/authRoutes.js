const authMiddleware = require('../middleware/auth');
const userRoutes = require('./userRoutes');

module.exports = (app)=>{

    app.use(authMiddleware);

    userRoutes(app);
}