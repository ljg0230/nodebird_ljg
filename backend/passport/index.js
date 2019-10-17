const passport = require('passport');
const db = require('../models');
const local = require('./local');

module.exports = () => {

    passport.serializeUser((user, done) => { // 서버 쪽에 [{ id: 3, cookie: 'example' }] ... 메모리 절약,보안
        return done(null, user.id); // return 을 해주는 것은 안전장치의 느낌
    });

    passport.deserializeUser( async(id, done) => { // id 를 바탕으로 나머지 유저 정보 찾기
        try {
            const user = await db.User.findOne({
              where: { id },
              include: [
                {
                  model: db.Post,
                  as: "Posts",
                  attributes: ["id"]
                },
                {
                  model: db.User,
                  as: "Followings",
                  attributes: ["id"]
                },
                {
                  model: db.User,
                  as: "Followers",
                  attributes: ["id"]
                }
              ]
            });
            return done(null, user); // req.user 에 저장된다
        } catch (e) {
            console.error(e);
            return done(e);
        }
    });

    local();
};