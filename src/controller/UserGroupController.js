const sequelize = require('../config/db');
const { Op } = require('sequelize');
class UserGroupController {
    register(idUser, idGroup) {
        return new Promise((resolve, reject) => {
            let db = sequelize.models.UserAndGroup;

            db.create({ typeUser: 'ADM', fkUser: idUser, fkGroup: idGroup })
                .then(() => {

                    this.getGroupsForUser(idUser)
                        .then(groups => {
                            resolve(groups);
                        })
                        .catch(error => {
                            reject(error);
                        })

                })
                .catch(error => {
                    let newError = { error, success: false, message: `error ao vincular grupo com usuário` };
                    reject(newError);
                })
        })
    }

    getGroupsForUser(idUser) {
        return new Promise((resolve, reject) => {
            let db = sequelize.models.UserAndGroup;

            db.findAll({
                where: {
                    fkUser: idUser
                }
            })
                .then(userGroups => {

                    let idsGroups = userGroups.map(element => {
                        return element.fkGroup;
                    });

                    resolve(idsGroups);
                })
                .catch(error => {
                    let newError = { error, success: false, message: `erro ao retornar grupos` };
                    reject(newError);
                })
        })
    }

    deleteGroupsAndUser(userId, groupId) {
        return new Promise((resolve, reject) => {
            let db = sequelize.models.UserAndGroup;

            db.destroy({
                where: {
                    [Op.and]: [
                        { fkUser: userId },
                        { fkGroup: groupId }
                    ]
                }
            })
                .then(response =>{
                    resolve(response);
                })
                .catch(error =>{
                    let newError = {
                        error,
                        success: false,
                        message: `Erro ao deletar do banco!`
                    };
                    reject(newError);
                })
        })
    }
}

module.exports = UserGroupController;