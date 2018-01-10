'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    googleId: DataTypes.STRING,
    token: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    pic: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
       
        User.hasMany(models.Space);
        User.hasMany(models.Reservation);
      }
    }
  });
  return User;
};