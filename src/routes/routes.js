
const publicRoutes = require('./publicRoutes');
const authRoutes = require('./authRoutes');

module.exports = (app)=> {
    publicRoutes(app);
    authRoutes(app);
}