const express = require('express');
const cors = require('cors')
const { dbConnection } = require('../database/config')
const { defaultAdmin } = require('../controllers/usuario');
const { defaultTipoCuentas } = require('../controllers/tipoCuenta');
const { defaultRoles } = require('../controllers/role');

class Server {
    constructor() {

        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth: '/banco/auth',
            usuario: '/banco/usuario',
            cuenta: '/banco/cuenta',
        }

        this.conectarDB();

        this.middlewares();

        this.routes();

        
        defaultTipoCuentas();
        
        defaultAdmin();

        defaultRoles();
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static("public"));
    }

    async conectarDB() {
        await dbConnection();
    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.cuenta, require('../routes/cuenta'));
        this.app.use(this.paths.usuario, require('../routes/usuario'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en el puerto ${this.port}`);
        })
    }
}


module.exports = Server;