const ExpenseController = require('../controller/ExpenseController');
const ExpenseAndGroupController = require('../controller/ExpenseAndGroupController');

module.exports = app => {
    const expenseController = new ExpenseController;
    const expenseGroupCont = new ExpenseAndGroupController;
    const routes = expenseController.routes();

    app.route(routes.expense)
        .post(expenseController.register())
        .get(expenseController.getExpense())
        .delete(expenseController.remove())
        .put(expenseController.edit());

    app.route(routes.expenseAll)
        .get(expenseController.getAllExpenses());

    app.route(routes.ExpenseGroup)
        .get(expenseGroupCont.getExpenseAndGroup());

}