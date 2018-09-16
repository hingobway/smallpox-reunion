const express = require('express');
const cloudinary = require('cloudinary');
const randomatic = require('randomatic');
const multer = require('multer');
const _ = require('lodash');
const async = require('async');
const prmsfy = require('util').promisify;
const { Entry, Image, User } = require('./models');
const parse = require('./parse');

const upl = multer();
const rand = len => randomatic('Aa0?', len, { chars: '-_' });
const err = require('./err');
const each = prmsfy(async.each);
const map = prmsfy(async.map);

const { PHOTO_KEY, PHOTO_SECRET } = process.env;

cloudinary.config({
  cloud_name: 'smallpox-reunion',
  api_key: PHOTO_KEY,
  api_secret: PHOTO_SECRET
});

const r = new express.Router();

const scopeDiff = (scopes, requiredScopes) => {
  scopes = scopes.split(' ');
  requiredScopes = requiredScopes.split(' ');
  let diff = _.difference(requiredScopes, scopes);
  if (diff.length === 0) return true;
  else return false;
};

r.get('/entry/all', (req, res) => {
  Entry.find().then(async obj =>
    res.json({
      entries: await map(obj, async cur => {
        const out = parse('entry', cur);
        out.before = await map(out.before, async cur =>
          parse('image', await Image.findById(cur))
        );
        out.after = await map(out.after, async cur =>
          parse('image', await Image.findById(cur))
        );
        out.user = _.omit(parse('user', await User.findById(out.user)), [
          'auth'
        ]);
        return out;
      })
    })
  );
});

r.post(
  '/entry/upload',
  upl.fields([{ name: 'before', maxCount: 3 }, { name: 'after', maxCount: 3 }]),
  async (req, res) => {
    let { body } = req;
    if (!(body.email !== '' && body.name !== ''))
      return err(res)(400, 'MISSING_USER_INFORMATION');
    let u = await User.findOne({ email: body.email });
    if (u && scopeDiff(u.scope, 'submitted'))
      return err(res)(403, 'USER_ALREADY_SUBMITTED');

    body.before = [];
    body.after = [];
    const cloud = name => (cur, cb) => {
      if (!cur.originalname.match(/\.(?:jpg|jpeg|png|gif|tiff)$/i))
        return err(res)(400, 'BAD_FILE_FORMAT');
      cloudinary.v2.uploader
        .upload_stream(async (err, resp) => {
          if (err) return err(res)(500, 'UPLOAD_FAILED', err);
          const ni = await new Image({ url: resp.url }).save();
          body[name].push(ni._id);
          cb();
        })
        .end(cur.buffer);
    };
    await each(req.files.before, cloud('before'));
    await each(req.files.after, cloud('after'));

    let { name, email, before, after } = body;
    let user;
    if (u) {
      u.scope += ' submitted';
      user = await u.save();
    } else {
      user = await new User({
        name,
        email,
        scope: 'submitted',
        auth: rand(32)
      }).save();
    }
    let entry = await new Entry({
      user: user._id,
      before,
      after
    }).save();
    let images = await map(entry.before, async cur =>
      parse('image', await Image.findById(cur))
    );
    await map(entry.after, async cur =>
      images.push(await parse('image', await Image.findById(cur)))
    );
    res.json({ entry, user: parse('user', user), images });
  }
);

r.post('/image/caption/bulk', async (req, res) => {
  await map(req.body.captions, async cur => {
    const image = await Image.findById(cur.id);
    if (!image) res.status(400).json({ error: 'IMAGE_NOT_FOUND' });
    else {
      image.caption = cur.caption;
      await image.save();
      return;
    }
  });
  res.json({ success: true });
});

r.post('/entry/store', async (req, res) => {
  if (
    !(
      req.body.email !== '' &&
      req.body.name !== '' &&
      req.body.before &&
      req.body.after
    )
  )
    return err(res)(400, 'MISSING_USER_INFORMATION');
  let u = await User.findOne({ email: req.body.email });
  if (u && scopeDiff(u.scope, 'submitted'))
    return err(res)(403, 'USER_ALREADY_SUBMITTED');

  let { name, email, before, after } = req.body;
  let user;
  if (u) {
    u.scope += ' submitted';
    user = await u.save();
  } else {
    user = await new User({
      name,
      email,
      scope: 'submitted',
      auth: rand(32)
    }).save();
  }
  let entry = await new Entry({
    user: user._id,
    before,
    after
  }).save();
  res.json({ entry: parse('entry', entry), user: parse('user', user) });
});

module.exports = r;
