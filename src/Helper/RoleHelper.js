'use strict';

class RoleHelper {
    constructor(client) {
        this.client = client;
    }

    hasUserRoleInServer(user, role, server) {
        if (user.id === this.client.admin.id) return true;

        if (!server || !server.roles) return false;

        role = server.roles.get('name', role);
        if (!role) return false;

        return this.client.memberHasRole(user, role);
    }
}

module.exports = RoleHelper;