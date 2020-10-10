const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.options = options;
    this.concatStr = '';
  }

  _transform(chunk, encoding, callback) {
    const str = chunk.toString();
    if (str.includes(os.EOL)) {
      const chunkArr = str.split(os.EOL);
      const strBeforeSpace = chunkArr[0];
      const strAfterSpace = chunkArr.slice(1).join('');
      this.push(this.concatStr + strBeforeSpace);
      this.concatStr = strAfterSpace;
    } else {
      this.concatStr += str;
    }
    callback();
  }

  _flush(callback) {
    this.push(this.concatStr);
    callback();
  }
}

module.exports = LineSplitStream;
