const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../models');

const router = express.Router();

// 공통되는 '/api/user' 는 분리시켰다
router.get("/", (req, res) => { // /api/user

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
        return next(e); // 알아서 front 에 에러가 생김을 알림. 이방법만 사용하면 에러처리가 안되므로 최후의 방법으로..
    }
});
router.get("/:id", (req, res) => { // 남의 정보 가져오기 ex) /api/user/3

});
router.post("/logout", (req, res) => {

});
router.post("/login", (req, res) => {

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