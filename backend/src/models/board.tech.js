'use strict';
module.exports = (sequelize, DataTypes) => {
  var board.tech = sequelize.define('board.tech', {
    parent: DataTypes.INTEGER,
    body: DataTypes.TEXT,
    identity_id: DataTypes.UUID,
    attachment_id: DataTypes.INTEGER
  }, {
    underscored: true,
  });
  board.tech.associate = function(models) {
    // associations can be defined here
  };
  return board.tech;
};