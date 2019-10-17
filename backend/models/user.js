module.exports = (sequelize, DataTypes) => {
  // 이 패턴이 반복된다
  const User = sequelize.define( // 테이블명은 users 
    "User",
    {
      nickname: {
        type: DataTypes.STRING(20), //20글자 이하로
        allowNull: false // 필수, true면 선택
      },
      userId: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: false // 고유한 값
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false
      }
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci" // 한글 저장 가능
    }
  );

  User.associate = db => {
    // 이 부분은 다른 테이블과 관계를 이어주기 위한 부분
    db.User.hasMany(db.Post, { as: "Posts" }); // Like Post 와 구분을 위해 as 사용, 값을 가져올땐 as값을 가져오므로 정의해주는 것이 좋다
    db.User.hasMany(db.Comment);
    db.User.belongsToMany(db.Post, { through: "Like", as: 'Liked' }); // n:m ... belongsToMany 는 어지간하면 as를 달자
    db.User.belongsToMany(db.User, {
      through: "Follow",
      as: "Followers",
      foreignKey: "followingId" // 실제 db에서 구별하는 Id, 남의 테이블 Id를 가리킨다
    });
    db.User.belongsToMany(db.User, {
      through: "Follow",
      as: "Followings",
      foreignKey: "followerId"
    });
  };

  return User;
};
