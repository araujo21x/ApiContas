const sequelize = require('../config/db');
const { Op } = require('sequelize');

class ExpenseAndGroupController {
    searchExistence(idGroup, belongDate) {
        return new Promise((resolve, reject) => {
            let db = sequelize.models.ExpenseAndGroup;

            db.findOne({ where: { [Op.and]: [{ fkGroup: idGroup }, { name: belongDate }] } })
                .then(expenseGroup => { resolve(expenseGroup.id); })
                .catch(() => {
                    db.create({ name: belongDate, fkGroup: idGroup })
                        .then(expenseGroup => {
                            resolve(expenseGroup.id)
                        })
                        .catch(error => { reject({ error, success: false, message: `erro ao cirar expenseGroup` }) });
                });
        })

    }

    getExpenseAndGroup() {
        return (req, res) => {
            let db = sequelize.models.ExpenseAndGroup;

            db.findAll({ where: { fkGroup: req.body.idGroup } })
                .then(expenseGroup => { res.status(200).json(expenseGroup) })
                .catch(error => { res.status(400).json({ error, message: "erro ao encontrar conjunto de despesas" }) });
        }
    }


}

module.exports = ExpenseAndGroupController;