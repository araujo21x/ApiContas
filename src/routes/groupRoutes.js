const GroupController = require('../controller/GroupController');

module.exports = (app) => {
    const groupController = new GroupController;
    const routes = groupController.routes();

    app.route(routes.group)
        .post(groupController.registerGroup())
        .get(groupController.getGroups())
        .delete(groupController.deleteGroup())
        .put(groupController.updateGroup());

    app.route(routes.userGroup)
        .get(groupController.getMemberForGroup())
        .post(groupController.addMember())
        .delete(groupController.deleteMemberForGroup())
        .patch(groupController.editMemberForGroup());

    app.delete(routes.exit, groupController.exitGroup());
    app.get(routes.getFilter, groupController.getFilterGroup());

}