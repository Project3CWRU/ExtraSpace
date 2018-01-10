'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Spaces', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ownerFirst: {
        type: Sequelize.STRING,
      },
      ownerLast: {
        type: Sequelize.STRING,
      },
      ownerEmail: {
        type: Sequelize.STRING,
      },
      renterFirst: {
        type: Sequelize.STRING,
        allowNull: true
      },
      renterLast: {
        type: Sequelize.STRING,
        allowNull: true
      },
      renterEmail: {
        type: Sequelize.STRING,
        allowNull: true
      },
      address: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.STRING
      },
      zipcode: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      price: {
        type: Sequelize.INTEGER
      },
      from: {
        type: Sequelize.DATE
      },
      to: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      photo: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      userId: {
        type: Sequelize.INTEGER,
        model: 'users',
        key: 'id'
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Spaces');
  }
};