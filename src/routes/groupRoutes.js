const GroupController = require('../controller/GroupContrller');

module.exports = (app) => {
    const groupController = new GroupController;
    const routes = groupController.routes();

    app.route(routes.group)
        .post(groupController.registerGroup())
        .get(groupController.getGroups())
        .delete(groupController.deleteGroup())
        .put(groupController.updateGroup());

    app.delete(routes.exit, groupController.exitGroup());
    app.get(routes.getFilter, groupController.getFilterGroup());

}