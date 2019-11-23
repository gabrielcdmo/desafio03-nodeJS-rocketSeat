import Sequelize, { Model } from 'sequelize';

class registrations extends Model    
{
    static init(sequelize)
    {
        super.init({
            start_date: Sequelize.DATE,
            end_date: Sequelize.DATE, 
            price: Sequelize.INTEGER,
        }, 
        { 
            sequelize 
        });
        return this;
    } 

    static associate(models)
    {
        this.belongsTo(models.students, { foreignKey: 'student_id'} );
        this.belongsTo(models.plans, { foreignKey: 'plan_id'} );
    }
}

export default registrations;