'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('help_orders', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false, 
        autoIncrement: true, 
      },
      student_id: {
        type: Sequelize.INTEGER, 
        references: { model: 'students', key: 'id' },
        allowNull: false, 
      },
      question: {
        type: Sequelize.STRING, 
        allowNull: false, 
      },
      answer: {
        type: Sequelize.STRING, 
        defaultValue: null, 
        allowNull: true
      },
      answer_at: {
        type: Sequelize.DATE, 
        allowNull: true, 
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
