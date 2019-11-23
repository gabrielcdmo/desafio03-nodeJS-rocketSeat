import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model    
{
    static init(sequelize)
    {
        super.init({
            email: Sequelize.STRING,
            password: Sequelize.VIRTUAL,
            password_hash: Sequelize.STRING, 
        }, 
        { 
            sequelize 
        });
        return this;
    }
    chekPassword(password)
    {
      return bcrypt.compare(password, this.password_hash);
    }
}

export default User;