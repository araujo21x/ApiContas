const sequelize = require('../config/db');

class UserGroupController {
    register(idUser, idGroup) {
        return new Promise((resolve, reject) => {
            let db = sequelize.models.UserAndGroup;

            db.create({ typeUser: 'ADM', fkUser: idUser, fkGroup: idGroup })
                .then(() => {

                    this.getGroupsForUser(idUser)
                        .then(groups =>{
                            resolve(groups);
                        })
                        .catch(error=>{
                            reject(error);
                        })

                })
                .catch(error => {
                    let newError = { error, success: false, message: `error ao vincular grupo com usuário`};
                    reject(newError);
                })
        })
    }

    getGroupsForUser(idUser) {
        return new Promise((resolve, reject) => {
            let db = sequelize.models.UserAndGroup;

            db.findAll({where: {
                fkUser: idUser
            }})
                .then(userGroups =>{

                    let idsGroups = userGroups.map(element =>{
                        return element.fkGroup;
                    });
                    
                    resolve(idsGroups);
                })
                .catch(error =>{
                    let newError = {error, success: false, message: `erro ao retornar grupos`};
                    reject(newError);
                })
        })
    }

}

module.exports = UserGroupController;