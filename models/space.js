'use strict';
module.exports = function(sequelize, DataTypes) {
  var Space = sequelize.define('Space', {
    address: DataTypes.STRING,
    ownerFirst: DataTypes.STRING,
    ownerLast: DataTypes.STRING,
    ownerEmail: DataTypes.STRING,
    renterFirst: DataTypes.STRING,
    renterLast: DataTypes.STRING,
    renterEmail: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zipcode: DataTypes.STRING,
    type: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.INTEGER,
    from: DataTypes.DATE,
    to: DataTypes.DATE,
    status: DataTypes.BOOLEAN,
    photo: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
       
        Space.belongsTo(models.User);
      }
    }
  });
  return Space;
};