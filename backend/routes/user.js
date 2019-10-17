const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const db = require('../models');

const router = express.Router();

// 공통되는 '/api/user' 는 분리시켰다

router.get("/", (req, res) => {
  // /api/user/
  if (!req.user) {
    return res.status(401).send("로그인이 필요합니다.");
  }
  const user = Object.assign({}, req.user.toJSON());
  delete user.password;
  return res.json(user);
});
router.post("/", async(req, res, next) => { // POST /api/user 회원가입
    try {
        const exUser = await db.User.findOne({
            where: {
                userId: req.body.userId,
            },
        });
        if(exUser) {
            return res.status(403).send('이미 사용중인 아이디입니다.'); // 403 이 무난 .. send 는 문자열 보내기
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 12); // 12 (salt round) 가 커질수 록 해킹 위험은 줄어드나 만드는데 시간이 오래걸림. 10~13 사이가 적당 
        const newUser = await db.User.create({
            nickname: req.body.nickname,
            userId: req.body.userId,
            password: hashedPassword,
        });
        console.log(newUser);
        return res.status(200).json(newUser); // json 은 json 데이터 보내기, 성공은 보통 200 이 무난
    } catch (e) {
        console.error(e);
        // 에러 처리는 여기서
        return next(e); // 알아서 front 에 에러가 생김을 알림. 이 방법만 사용하면 에러처리가 안되므로 처리 후 마지막에..
    }
});
router.get("/:id", (req, res) => { // 남의 정보 가져오기 ex) /api/user/3

});
router.post("/logout", (req, res) => {
    req.logout();
    req.session.destroy();
    res.send('logout 성공');
});
router.post("/login", (req, res, next) => { // POST /api/user/login
    passport.authenticate('local', (err, user, info) => { // err,user,info -> done의 3가지 인자들
        if (err) { // 서버 상 에러
            console.error(err);
            return next(err); 
        }
        if (info) { // 로직 상 에러
            return res.status(401).send(info.reason);
        }
        return req.login(user, async loginErr => {
          try {
            if (loginErr) {
              return next(loginErr);
            }
            const fullUser = await db.User.findOne({
              where: { id: user.id },
              include: [
                {
                  model: db.Post,
                  as: "Posts",
                  attributes: ["id"] // id만
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
              ],
              attributes: ["id", "nickname", "userId"] // 비밀번호만 빼고 보내기
            });
            console.log(fullUser);
            return res.json(fullUser);
          } catch (e) {
            next(e);
          }
        });
    })(req, res, next);
});
router.get("/:id/follow", (req, res) => {

});
router.post("/:id/follow", (req, res) => {

});
router.delete("/:id/follow", (req, res) => {

});
router.delete("/:id/follower", (req, res) => {

});
router.get("/:id/posts", (req, res) => {

});

module.exports = router;