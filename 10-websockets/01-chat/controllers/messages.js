const Message = require('../models/Message');
const mapMessage = require('../mappers/message');

module.exports.messageList = async function messages(ctx, next) {
  const messages = await Message.find({user: ctx.user.displayName});

  if (!messages) {
    ctx.body = { messages: [] };
  }

  ctx.body = { messages: messages.map(mapMessage).slice(-20)};
};
