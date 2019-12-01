const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { isLoggedIn } = require('./middleware');
const db = require("../models");

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
    }
  }),
  limits: { fileSize: 20 * 1024 * 1024 } // 20mb로 제한
});

router.post("/", isLoggedIn, upload.none(), async (req, res, next) => {  // upload.none -> 주소들은 이미지가 아닌 텍스트.
  // /api/post
  try {
        const hashtags = req.body.content.match(/#[^\s]+/g); // 정규 표현식
        const newPost = await db.Post.create({
          content: req.body.content,
          UserId: req.user.id
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
        // 이미지 주소를 따로 DB에 저장한 후, 게시글과 연결
        if (req.body.image) {
          // 이미지 주소를 여러개 올리면 image: [주소1, 주소2]
          if (Array.isArray(req.body.image)) {
            const images = await Promise.all(req.body.image.map((image) => {
              return db.Image.create({ src: image }); // 배열에 들어있는 내용을 한 번에 처리
            }));
            await newPost.addImages(images);
          } else { // 이미지 주소를 하나만 올리면 image: 주소1  => 배열인지 아닌지 구별 필요
            const image = await db.Image.create({ src: req.body.image });
            await newPost.addImage(image);
          }
        }
        // const User = await newPost.getUser();
        // newPost.User = User;
        // res.json(newPost);
        //위 또는 아래 방식
        const fullPost = await db.Post.findOne({
          where: { id: newPost.id },
          include: [
            {
              model: db.User
            }, {
              model: db.Image
            }
          ],
        });
        res.json(fullPost);
      } catch (e) {
    console.error(e);
    next(e);
  }
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

router.post('/:id/like', isLoggedIn, async (req, res, next) => {
  try {
    const post = await db.Post.findOne({ where: { id: req.params.id }});
    if (!post) {
      return res.status(404).send('포스트가 존재하지 않습니다.');
    }
    await post.addLiker(req.user.id); // 시퀄라이즈 관계에서 addLiker가 자동으로 만들어짐
    res.json({ userId: req.user.id });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.delete("/:id/like", isLoggedIn, async (req, res, next) => {
  try {
    const post = await db.Post.findOne({ where: { id: req.params.id } });
    if (!post) {
      return res.status(404).send("포스트가 존재하지 않습니다.");
    }
    await post.removeLiker(req.user.id); // removeLiker 시퀄라이즈에서 자동으로 만들어줌
    res.json({ userId: req.user.id });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post('/:id/retweet', isLoggedIn, async (req, res, next) => {
  try {
    const post = await db.Post.findOne({ 
      where: { id: req.params.id },
      include: [{
        model: db.Post,
        as: 'Retweet',
      }], 
    });
    if (!post) {
      return res.status(404).send("포스트가 존재하지 않습니다.");
    }
    if (req.user.id === post.UserId || (post.Retweet && post.Retweet.UserId === req.user.id)) {
      return res.status(403).send('자신의 글은 리트윗할 수 없습니다.');
    }
    const retweetTargetId = post.RetweetId || post.id;
    const exPost = await db.Post.findOne({
      where: {
        UserId: req.user.id,
        RetweetId: retweetTargetId,
      },
    });
    if (exPost) {
      return res.status(403).send('이미 리트윗했습니다.');
    }
    const retweet = await db.Post.create({
      UserId: req.user.id,
      RetweetId: retweetTargetId,
      content: 'retweet',
    });
    const retweetWithPrevPost = await db.Post.findOne({
      where: { id: retweet.id },
      include: [
        {
          model: db.User,
          attributes: ["id", "nickname"]
        },
        {
          model: db.Post,
          as: "Retweet",
          include: [
            {
              model: db.User,
              attributes: ["id", "nickname"]
            },
            {
              model: db.Image
            }
          ]
        }
      ]
    });
    res.json(retweetWithPrevPost);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;
