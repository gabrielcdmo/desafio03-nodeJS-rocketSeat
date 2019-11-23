import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class students extends Model    
{
    static init(sequelize)
    {
        super.init({
            name: Sequelize.STRING,
            email: Sequelize.STRING, 
            idade: Sequelize.INTEGER,
            altura: Sequelize.INTEGER
        }, 
        { 
            sequelize 
        });
        return this;
    } 
}

export default students;
