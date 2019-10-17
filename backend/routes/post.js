const express = require("express");
const router = express.Router();
const db = require("../models");

router.post("/", async (req, res, next) => {
  // /api/post
  try {
    const hashtags = req.body.content.match(/#[^\s]+/g); // 정규 표현식
    const newPost = await db.Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map(tag =>
          db.Hashtag.findOrCreate({
            where: { name: tag.slice(1).toLowerCase() }
          })
        )
      );
      console.log(result);
      await newPost.addHashtags(result.map(r => r[0]));
    }
    // const User = await newPost.getUser();
    // newPost.User = User;
    // res.json(newPost);
    //위 또는 아래 방식
    const fullPost = await db.Post.findOne({
        where: { id: newPost.id },
        include: [{
            model: db.User,
        }]
    })
    res.json(fullPost);
  } catch (e) {
    console.error(e);
    next(e);
  }
});
router.post("/image", (req, res) => {});

module.exports = router;
