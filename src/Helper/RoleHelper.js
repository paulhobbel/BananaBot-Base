'use strict';

class RoleHelper {
    constructor(client) {
        this.client = client;
    }

    hasUserRoleInServer(user, role, server) {
        if (!server || !server.roles) return false;

        role = server.roles.get('name', role);
        if (!role) return false;

        return this.memberHasRole(user, role) || user.id === this.client.admin.id;
    }
}

module.exports = RoleHelper;