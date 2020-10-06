const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.options = options;
    this.arr = [];
  }

  _transform(chunk, encoding, callback) {
    let error;
    this.arr.push(chunk);
    if (this.arr.length === this.options.limit) {
      error = new LimitExceededError;
    }
    callback(error, chunk);
  };
}

module.exports = LimitSizeStream;