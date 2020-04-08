class UserDao {
    constructor(user){
        this._User = user;
    }
    
    register(body, res){
        this._User.create({
            name: body.name,
            email: body.email,
            login: body.login,
            password: body.password,
        }).then(()=>{
            res.status(200).json(true);
        }).catch((err)=>{
            console.log(err);
        });
    }

}

module.exports = UserDao;