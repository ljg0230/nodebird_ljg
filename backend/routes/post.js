const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { isLoggedIn } = require('./middleware');
const db = require("../models");

router.post("/", isLoggedIn, async (req, res, next) => {
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

const upload = multer({
  storage: multer.diskStorage({
    // 서버쪽 디스크에 저장하겠다
    destination(req, file, done) {
      done(null, "uploads");
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      const basename = path.basename(file.originalname, ext); // ex) ljg.png --> ext === .png, basename === ljg
      done(null, basename + new Date().valueOf() + ext); // 이름이 중복될 경우 대비
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20mb로 제한
});
router.post("/images", upload.array('image'), (req, res) => { // FormData 에서 append 하는 이름 'image' , 이미지 한 장만 올릴거면 single, 여러장 합쳐서 올릴거면 array
  console.log(req.files);
  res.json(req.files.map(v => v.filename));
});

router.get('/:id/comments', async (req, res, next) => {
  try {
    const post = await db.Post.findOne({ where: { id: req.params.id } }); // 게시글 확인하기
    if (!post) {
      return res.status(404).send("포스트가 존재하지 않습니다.");
    }
    const comments = await db.Comment.findAll({
      where: {
        PostId: req.params.id,
      },
      order: [['createdAt', 'ASC']],
      include: [{
        model: db.User,
        attributes: ['id', 'nickname'],
      }],
    });
    res.json(comments);
  } catch (e) {
    console.error(e);
    return next(e);
  }
});

router.post('/:id/comment', isLoggedIn, async (req, res, next) => { // POST /api/post/3/comment
  try {
    const post = await db.Post.findOne({ where: { id: req.params.id } });
    if (!post) {
      return res.status(404).send('포스트가 존재하지 않습니다.');
    }
    const newComment = await db.Comment.create({
      PostId: post.id,
      UserId: req.user.id,
      content: req.body.content,
    });
    await post.addComment(newComment.id);
    const comment = await db.Comment.findOne({
      where: {
        id: newComment.id,
      },
      include: [{
        model: db.User,
        attributes: ['id', 'nickname'],
      }],
    })
    return res.json(comment);
  } catch (e) {
    console.error(e);
    return next(e);
  }
})

module.exports = router;
