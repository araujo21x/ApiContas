const GroupController = require('../controller/GroupContrller');

module.exports = (app) => {
    const groupController = new GroupController;
    const routes = groupController.routes();

    app.route(routes.group)
        .post(groupController.registerGroup())
        .get(groupController.getGroup())
        .delete(groupController.deleteGroup())
        .put(groupController.updateUser());

    app.get(routes.getFilter, groupController.getFilterGroup());

}