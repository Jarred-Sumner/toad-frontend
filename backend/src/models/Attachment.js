export default (sequelize, DataTypes) => {
  const attachment = sequelize.define(
    'attachment',
    {
      type: {
        type: DataTypes.ENUM('file'),
        defaultValue: 'file',
        allowNull: false,
      },
      mimetype: DataTypes.STRING,
      board: DataTypes.STRING,
      filename: DataTypes.STRING,
      filename: DataTypes.STRING,
      url: DataTypes.TEXT,
      identity_id: DataTypes.UUID,
    },
    {
      underscored: true,
    }
  )
  attachment.associate = function(models) {
    // associations can be defined here
  }
  return attachment
}
