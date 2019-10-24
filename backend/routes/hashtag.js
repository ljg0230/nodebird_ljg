const express = require('express');
const db = require('../models');

const router = express.Router();

router.get('/:tag', async (req, res, next) => {
    try {
        const posts = await db.Post.findAll({ // where 조건문이 hashtag 인 위치에
            include: [{
                model: db.Hashtag,
                where: { name: decodeURIComponent(req.params.tag) }, // decodeURIComponent -> 주소창에 한글 또는 특수문자가 들어갈 경우 사용
            }, {
                model: db.User, // 작성자 정보 불러오기
                attributes: ['id', 'nickname'],
            }],
        });
        res.json(posts);
    } catch (e) {
        console.error(e);
        next(e);
    }
});

module.exports = router;