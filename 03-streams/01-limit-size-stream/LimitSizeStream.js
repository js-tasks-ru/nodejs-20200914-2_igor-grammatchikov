const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.options = options;
    this.byteCount = 0;
  }

  _transform(chunk, encoding, callback) {
    let error;
    this.byteCount += chunk.length;
    if (this.byteCount === this.options.limit) {
      error = new LimitExceededError;
    }
    callback(error, chunk);
  };
}

module.exports = LimitSizeStream;
