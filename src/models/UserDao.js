class UserDao {

    constructor(sequelize) {
        this._db = sequelize;
    }

    register(newUser){
        console.log(newUser.user);
    }

}

module.exports = UserDao;