// 여기를 중앙통제실 개념으로 보면 될 듯

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const expressSesion = require('express-session');
const dotenv = require('dotenv');
const passport = require('passport');

const passportConfig = require('./passport');
const db = require('./models');
const userAPIRouter = require('./routes/user');
const postAPIRouter = require("./routes/post");
const postsAPIRouter = require("./routes/posts");

dotenv.config(); // .env 파일을 읽어온다
const app = express();
db.sequelize.sync();
passportConfig();

app.use(morgan('dev')); // 요청에 대한 로그를 남긴다
app.use(express.json()); // json 데이터 처리
app.use(express.urlencoded({ extended: true })); // form 으로 넘어온 데이터 처리
app.use(
  cors({
    origin: true, // 쿠키 교환 가능, 요청주소랑 같게
    credentials: true // 쿠키 교환 가능
  })
); // 다른 서버에서 요청이와도 처리가능하게(브라우저 access control allow origin 에러 해결)
app.use(cookieParser(process.env.COOKIE_SECRET)); // 쿠키 파싱 및 암호화
app.use(expressSesion({
    resave: false, // 매번 새션 강제 저장
    saveUninitialized: false, // 빈 값도 저장
    secret: process.env.COOKIE_SECRET, // 암호화 
    cookie: {
        httpOnly: true, // javascript 로 접근 불가 -> 해킹 방어
        secure: false, // https를 쓸 때 true 로 
    },
    name: 'leejg',
})); 
app.use(passport.initialize());
app.use(passport.session()); // expressSession 아래에 있어야 함. 미들웨어간에 서로 의존관계가 있으므로 순서가 중요하다

// API는 다른 서비스가 내 서비스의 기능을 실행할 수 있게 열어둔 창구
app.use('/api/user', userAPIRouter);
app.use("/api/post", postAPIRouter);
app.use("/api/posts", postsAPIRouter);


app.listen(3066, () => {
    console.log('server is running on http://localhost:3066');
});