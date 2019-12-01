const express = require('express');
const db = require('../models');
const router = express.Router();

router.get("/", async (req, res, next) => { // GET /api/posts
    try {
        const posts = await db.Post.findAll({
          include: [
            {
              model: db.User,
              attributes: ["id", "nickname"],
            }, {
              model: db.Image,
            }, {
              model: db.User,
              through: 'Like',
              as: 'Likers',
              attributes: ['id'],
            }, {
              model: db.Post,
              as: 'Retweet',
              include: [{
                model: db.User,
                attributes: ['id', 'nickname'],
              }, {
                model: db.Image,
              }]
            }
          ],
          order: [["createdAt", "DESC"]] // DESC는 내림차순, ASC는 오름차순.  2차원 배열인 이유는 2순위 옵션을 더 넣을 수 있음
        });
        res.json(posts); // toJASON 안쓴이유 -> 기본적으론 안쓰고 db에서 가져온 객체를 변형하는 경우에 사용
    } catch (e) {
        console.error(e);
        next(e);
    }
});

module.exports = router;