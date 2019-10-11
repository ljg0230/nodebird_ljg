const express = require("express");
const db = require('../models');
const router = express.Router();

router.post("/", async (req, res) => { // /api/post
    try {
        const hashtags = req.body.content.match(/#[^\s]+/g); // 정규표현식
        const newPost = await db.Post.create({
            content: req.body.content,
            UserId: req.user.id,
        });
        if (hashtags) {
            const result = await Promise.all(hashtags.map(tag => db.Hashtag.findOrCreate({ // findOrCreate -> 없으면 만들고, 있으면(찾아서) 스킵
                where: {
                    name: tag.slice(1).toLowerCase() // '#' 제거하고 소문자로 통일
                },
            })));
            console.log(result);
            await newPost.addHashtags(result.map(r => r[0])); // Post 에 만든 태그들을 연결해준다 , addHashtags -> 시퀄라이즈의 associate 에서 'as'로 정의된 내용을 찾거나 만들어준다
        }

        // const User = await newPost.getUser(); 
        // newPost.User = User;
        // res.json(newPost);

        // 위 방식 또는 아래 방식
        const fullPost = await db.Post.findOne({
            where: { id: newPost },
            include: [{
                model: db.User,
            }],
        });
        res.json(fullPost);
    } catch (e) {
        console.error(e);
        next(e);
    }
});
router.post("/image", (req, res) => {

});

module.exports = router;
