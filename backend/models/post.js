module.exports = (sequelize, DataTypes) => {
  // 이 패턴이 반복된다
  const Post = sequelize.define(
    "Post", // 테이블명은 posts
    {
      constent: {
        type: DataTypes.TEXT, // 매우 긴 글
        allowNull: false
      }
    },
    {
      charset: "utf8mb4", // 한글 + 이모티콘
      collate: "utf8mb4_general_ci" // 한글+이모티콘 저장
    }
  );

  Post.associate = db => {
    // 이 부분은 다른 테이블과 관계를 이어주기 위한 부분
    db.Post.belongsTo(db.User); // Post 테이블에 UserId 저장
    db.Post.hasMany(db.Commnet);
    db.Post.hasMany(db.Image);
    db.Post.belongsTo(db.Post, { as: "Retweet" }); // Retweet, 두 Post 의 구분을 위해 이름을 지어준다
    db.Post.belongsToMany(db.Hashtag, { through: "PostHashtag" }); // n:m 관계
    db.Post.belongsToMany(db.User, { through: "Like", as: "Liker" }); // n:m
  };;

  return Post;
};
