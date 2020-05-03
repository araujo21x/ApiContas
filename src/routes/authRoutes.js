const authMiddleware = require('../middleware/auth');
const userRoutes = require('./userRoutes');
const groupRoutes = require('./groupRoutes');
const expenseRoutes = require('./expenseRoutes');

module.exports = (app)=>{

    app.use(authMiddleware);

    userRoutes(app);
    groupRoutes(app);
    expenseRoutes(app);
}