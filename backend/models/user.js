module.exports = (sequelize, DataTypes) => {
    // 이 패턴이 반복된다
    const User = sequelize.define('User', {
        nickname: {
            type: DataTypes.STRING(20), //20글자 이하로
            allowNull: false, // 필수, true면 선택
        },
        userId: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: false, // 고유한 값
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
    }, {
        charset: 'utf8', 
        collate: 'utf-_general_ci',  // 한글 저장 가능
    });

    User.associate = (db) => {
        // 이 부분은 다른 테이블과 관계를 이어주기 위한 부분
        db.User.hasMany(db.Post);
        db.User.hasMany(db.Commnet);
    }

    return User;
};