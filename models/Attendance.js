const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  role: String,
  voiceChannel: String,
  usernames: [String],
  timestamp: Date
});

module.exports = mongoose.model('Attendance', attendanceSchema);
