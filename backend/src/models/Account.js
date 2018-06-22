export default (sequelize, DataTypes) => {
  const account = sequelize.define(
    'account',
    {
      email: DataTypes.STRING,
    },
    {
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ['email'],
        },
      ],
    }
  )
  account.associate = function(models) {
    // associations can be defined here
  }
  return account
}
