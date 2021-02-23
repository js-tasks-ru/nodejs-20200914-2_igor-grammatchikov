const { v4: uuid } = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');
const Session = require('../models/Session');

module.exports.register = async (ctx, next) => {
  const {email, displayName, password} = ctx.request.body;
  const verificationToken = uuid();

  const user = new User({
    email,
    displayName,
    verificationToken,
  });

  await user.setPassword(password);
  await user.save();

  await sendMail({
    template: 'confirmation',
    to: email,
    subject: 'Подтвердите почту',
    locals: {token: verificationToken},
  });

  ctx.status = 200;
  ctx.body = {status: 'ok'};
};

module.exports.confirm = async (ctx, next) => {
  const user = await User.findOne({verificationToken: ctx.request.body.verificationToken});

  if (!user) {
    ctx.throw(400, 'Ссылка подтверждения недействительна или устарела');
  }

  await user.set('verificationToken', undefined);
  await user.save();

  const token = uuid();
  await Session.create({token, user, lastVisit: new Date()});
  
  ctx.body = { token };
};
