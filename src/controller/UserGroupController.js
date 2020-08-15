const sequelize = require('../config/db');
const { Op } = require('sequelize');
class UserGroupController {

    register(idUser, idGroup, type) {
        return new Promise((resolve, reject) => {
            let db = sequelize.models.UserAndGroup;
            this.verificationRepeatUser(idUser, idGroup).then(() => {

                db.create({ typeUser: type, fkUser: idUser, fkGroup: idGroup })
                    .then(() => {
                        if (type === "ADM") {
                            this.getGroupsForUser(idUser)
                                .then(groups => {
                                    resolve(groups);
                                })
                                .catch(error => {
                                    reject(error);
                                });
                        } else {
                            this.getUsersForGroup(idGroup)
                                .then(idsUser => {
                                    resolve(idsUser)
                                })
                                .catch(error => {
                                    reject(error)
                                });
                        }
                    })
                    .catch(error => {
                        let newError = { error, success: false, message: `error ao vincular grupo com usuário` };
                        reject(newError);
                    });
            }).catch(error => {
                reject(error);
            });
        })
    }

    getUsersForGroup(idGroup) {
        return new Promise((resolve, reject) => {
            let db = sequelize.models.UserAndGroup;

            db.findAll({
                where: {
                    fkGroup: idGroup
                }
            })
                .then(groupsUser => {
                    let userSearch = groupsUser.map(element => {
                        return { fkUser: element.fkUser, typeUser: element.typeUser };
                    })
                    resolve(userSearch);
                })
                .catch(error => {
                    let newError = { error, success: false, message: `erro ao retornar grupos` };
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
                .then(response => {
                    resolve(response);
                })
                .catch(error => {
                    let newError = {
                        error,
                        success: false,
                        message: `Erro ao deletar do banco!`
                    };
                    reject(newError);
                })
        })
    }

    modifyUserforGroup(idUser, idGroup, typeUser) {
        return new Promise((resolve, reject) => {
            let db = sequelize.models.UserAndGroup;

            db.update({ typeUser: typeUser }, { where: { [Op.and]: [{ fkUser: idUser, fkGroup: idGroup }] } })
                .then(response => { resolve(response)})
                .catch(error => { reject({ error, success: false }) });
        });
    }

    verificationRepeatUser(idUser, idGroup) {
        return new Promise((resolve, reject) => {
            let db = sequelize.models.UserAndGroup;

            db.findOne({
                where: { [Op.and]: [{ fkUser: idUser }, { fkGroup: idGroup }] }
            }).then(response => {
                response === null ? resolve() : reject({ success: false, message: `Usuário já Cadastrado no grupo` });
            }).catch(error => {
                reject({ error, success: false });
            })
        })
    }
}

module.exports = UserGroupController;