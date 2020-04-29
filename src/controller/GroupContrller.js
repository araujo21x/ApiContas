const sequelize = require('../config/db');
const UserGroupController = require('./UserGroupController');
class GroupController {
    routes() {
        return {
            group: '/group',
            getFilter: '/groupFilter',
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
                                this.getGroups(idSearch, db)
                                    .then(groups => {
                                        res.status(200).json(groups);
                                    })
                                    .catch(error =>{
                                        res.status(400).json(error);
                                    })

                            })
                            .catch(error => {
                                res.status(400).json({error, message: `error ao registar user e group`});
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
    getGroups(idSearch, db) {
        return new Promise((resolve, reject) => {
            console.log(idSearch)
            db.findAll({
                where: {
                    id: idSearch
                }
            })
                .then(groups => {
                    resolve(groups);
                })
                .catch(error => {
                    let newError = {error, success: false, message:`erro ao retornar grupos`}
                    reject(newError);
                })
        })
    }
    getGroup() {
        return (req, res) => {

        }
    }

    deleteGroup() {
        return (req, res) => {

        }
    }

    updateUser() {
        return (req, res) => {

        }
    }

    getFilterGroup() {
        return (req, res) => {

        }
    }

    permisioUser() {
        return new Promise((resolve, reject) => {

        });
    }
}

module.exports = GroupController;