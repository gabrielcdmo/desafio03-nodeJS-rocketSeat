import Sequelize from 'sequelize'
import databaseConfig from '../config/database';

import students from '../app/models/students';
import user from '../app/models/user';
import registrations from '../app/models/registrations';
import plans from '../app/models/plans';
import chekins from '../app/models/chekins';
import HelpOrder from '../app/models/helpOrder';

const models = [students, user, registrations, plans, chekins, HelpOrder];

class Database{
    constructor()
    {
        this.init();
    }
    init()
    {
        this.connection = new Sequelize(databaseConfig);
        models
        .map(model => model.init(this.connection))
        .map(model => model.associate && model.associate(this.connection.models));
    }
}

export default new Database();