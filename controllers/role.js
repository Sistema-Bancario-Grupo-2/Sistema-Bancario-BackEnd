const Role = require('../models/role');

const defaultRoles = async () => {
    try {

        const rolesEncontrados = await Role.find();
        if (rolesEncontrados.length > 0) {
            return console.log("Roles listos!");
        }

        let roles1 = new Role();
        let roles2 = new Role();
        roles1.rol = "ADMIN_ROLE"
        roles2.rol = "CLIENTE_ROLE"


        await roles1.save();
        await roles2.save();

        console.log("Roles listos!");
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = {
    defaultRoles
}