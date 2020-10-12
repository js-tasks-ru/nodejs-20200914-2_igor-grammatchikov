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
      const linesArr = str.split(os.EOL);
      linesArr.forEach((item, index) => {
        if (!item) {
          this.push(this.concatStr);
          this.concatStr = '';
        }
        if (index === linesArr.length - 1 ) {
          this.concatStr += item;
        } else {
          this.push(this.concatStr + item);
          this.concatStr = '';
        }
      });
    } else {
      this.concatStr += str;
    }
    callback();
  }

  _flush(callback) {
    this.push(this.concatStr);
    this.concatStr = '';
    callback();
  }
}

module.exports = LineSplitStream;
