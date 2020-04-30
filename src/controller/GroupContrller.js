const sequelize = require('../config/db');
const { Op } = require('sequelize');
const UserGroupController = require('./UserGroupController');
class GroupController {
    routes() {
        return {
            group: '/group',
            getFilter: '/groupFilter',
            exit: `/exitGroup`
        }
    }

    registerGroup() {
        return (req, res) => {
            let db = sequelize.models.Group;

            if (req.body.name !== "" || req.body.name !== null || typeof req.body.name !== undefined) {

                db.create({ name: req.body.name, description: req.body.description })
                    .then(group => {

                        let userGroupController = new UserGroupController;

                        userGroupController.register(req.userId, group.id)
                            .then(idSearch => {
                                this.searchGroups(idSearch, db)
                                    .then(groups => {
                                        res.status(200).json(groups);
                                    })
                                    .catch(error => {
                                        res.status(400).json(error);
                                    })

                            })
                            .catch(error => {
                                res.status(400).json({ error, message: `error ao registar user e group` });
                            });

                    })
                    .catch(error => {
                        res.status(400).json({ error, success: false });
                    })

            } else {
                res.status(400).json({ success: false, message: `Preencha o campo nome!` })
            }

        }
    }

    getGroups() {
        return (req, res) => {
            let userGroupController = new UserGroupController;
            let db = sequelize.models.Group;

            userGroupController.getGroupsForUser(req.userId)
                .then(idsGroups => {
                    this.searchGroups(idsGroups, db)
                        .then(groups => {
                            res.status(200).json(groups);
                        })
                        .catch(error => {
                            res.status(400).json(error);
                        })
                })
                .catch(error => {
                    res.status(400).json(error);
                })

        }
    }

    deleteGroup() {
        return (req, res) => {
            this.permisioUser(req.userId, req.body.id)
                .then(() => {
                    let dbGroup = sequelize.models.Group;

                    dbGroup.destroy({
                        where: {
                            id: req.body.id
                        }
                    })
                        .then(response => {
                            res.status(200).json(response);
                        })
                        .catch(error => {
                            res.status(400).json({ error, success: false, message: `Erro apagar no banco!` });
                        })
                })
                .catch(error => {
                    res.status(400).json(error);
                })
        }
    }

    exitGroup() {
        return (req, res) => {
            let userGroupController = new UserGroupController;

            userGroupController.deleteGroupsAndUser(req.userId, req.body.id)
                .then(response => {
                    res.status(200).json(response);
                })
                .catch(error => {
                    res.status(400).json(error);
                })
        }
    }

    updateGroup() {
        return (req, res) => {
            this.permisioUser(req.userId, req.body.id)
                .then(() => {
                    let db = sequelize.models.Group;

                    db.update(
                        {
                            name: req.body.name,
                            description: req.body.description
                        },
                        {
                            where: {
                                id: req.body.id
                            }
                        })
                        .then(response => {
                            if(response[0] == 0){
                                res.status(400).json({success:false, message:` Erro ao fazer update no banco`});
                            }else{
                                res.status(200).json({success:true, message: `Grupo modificado!`});
                            }
                        })
                        .catch(error => {
                            res.status(400).json({error,success:false, message:` Erro ao fazer update no banco`});
                        })
                })
                .catch(error => {
                    res.status(400).json(error);
                })
        }
    }

    getFilterGroup() {
        return (req, res) => {

        }
    }

    searchGroups(idSearch, db) {
        return new Promise((resolve, reject) => {

            db.findAll({
                where: {
                    id: idSearch
                }
            })
                .then(groups => {
                    resolve(groups);
                })
                .catch(error => {
                    let newError = { error, success: false, message: `erro ao retornar grupos` }
                    reject(newError);
                })
        })
    }

    permisioUser(idUser, idGroup) {
        return new Promise((resolve, reject) => {
            let db = sequelize.models.UserAndGroup;

            db.findAll({
                where: {
                    [Op.and]: [
                        { fkUser: idUser },
                        { fkGroup: idGroup }
                    ]
                }
            }).then(userAndGroup => {

                if (userAndGroup[0].typeUser !== 'ADM') {
                    let error = {
                        success: false,
                        message: `Usuario não é ADM`
                    };

                    reject(error);

                } else {
                    resolve();
                }

            })
                .catch(error => {
                    let newError = {
                        error,
                        success: false,
                        message: `Erro ao vincular usuario e grupo no banco`
                    };
                    reject(newError)
                })
        });
    }
}

module.exports = GroupController;