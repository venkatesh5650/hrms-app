
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const RevokedToken = sequelize.define("RevokedToken", {
  token: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: "revoked_tokens",
  timestamps: false,
});

module.exports = RevokedToken;
