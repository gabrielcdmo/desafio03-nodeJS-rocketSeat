import Sequelize, { Model } from 'sequelize';

class Chekins extends Model    
{
    static init(sequelize)
    {
        super.init({

        }, 
        { 
            sequelize 
        });
        return this;
    }

    static associate(models)
    {
        this.belongsTo(models.students, { foreignKey: 'student_id'});
    }
}

export default Chekins;