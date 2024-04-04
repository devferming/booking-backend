const { DataTypes } = require('sequelize');
const sequelize = require('../utils/connection');

const Image = sequelize.define('image', {
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  }
  // hotelId
},{
  timestamps: false
});

module.exports = Image;