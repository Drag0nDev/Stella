const config = require('../../../config.json');

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('server', {
            serverId: DataTypes.STRING,
            prefix: DataTypes.STRING,
            muteRoleId: DataTypes.STRING,
            modlogChannel: DataTypes.STRING,
            joinLeaveLogChannel: DataTypes.STRING,
            memberLogChannel: DataTypes.STRING,
            serverLogChannel: DataTypes.STRING,
            messageLogChannel: DataTypes.STRING,
            voiceLogChannel: DataTypes.STRING,
            levelUpMessage: DataTypes.STRING,
            levelUpRoleMessage: DataTypes.STRING
        },
        {
            timestamps: false,
        }
    );
};