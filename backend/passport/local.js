const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');
const db = require('../models');

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'userId', // front 에서 req.body 에 넣어준 값들
        passwordField: 'password',
    }, async(userId, password, done) => {
        try { // 로그인 전략
            const user = await db.User.findOne({ where: { userId }}) // 기존사용자 확인
            if (!user) {
                return done(null, false, { reason: '존재하지 않는 사용자입니다.' }); // 1번째 인자 -> 서버 상 에러, 2번째 -> 성공 시, 3번째 -> 로직 상 에러(강제로 중단)
            }
            const result = await bcrypt.compare(password, user.password); // 비밀번호 비교 후 true||false
            if (result) {
                return done(null, user); // 성공한 경우
            }
            return done(null, false, { reason: '비밀번호가 틀립니다.' });
        } catch (e) {
            console.error(e);
            return done(e);
        }
    }));
};