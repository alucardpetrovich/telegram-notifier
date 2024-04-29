const child = require("child_process");

exports.errorAlarm = () => child.execSync("C:\\Users\\Documents\\error.mp3");
exports.newMessageAlarm = () =>
  child.execSync("C:\\Users\\Documents\\alert.mp3");
