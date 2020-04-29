const authMiddleware = require('../middleware/auth');
const userRoutes = require('./userRoutes');
const groupRoutes = require('./groupRoutes');
module.exports = (app)=>{

    app.use(authMiddleware);

    userRoutes(app);
    groupRoutes(app);
    
}