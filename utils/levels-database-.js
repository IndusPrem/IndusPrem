// levels-database.js
const mongoose = require('mongoose');

// Define the schema for levels
const levelSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  guildId: { type: String, required: true },
  username: { type: String, required: true },
  xp: { type: Number, default: 0 },
  totalXp: { type: Number, default: 0 },
  level: { type: Number, default: 1 }
});

// Create a compound index for userId and guildId to make lookups faster
levelSchema.index({ userId: 1, guildId: 1 }, { unique: true });

// Create the model
const LevelModel = mongoose.model('Level', levelSchema);

// Get user data (returns null if not found)
async function getUserData(guildId, userId) {
  try {
    return await LevelModel.findOne({ guildId, userId }).lean();
  } catch (error) {
    console.error('Error getting user level data:', error);
    return null;
  }
}

// Update user XP and level
async function updateUserXp(guildId, userId, username, xpToAdd) {
  try {
    // Find the user or create if not exists
    let userData = await LevelModel.findOne({ guildId, userId });
    
    if (!userData) {
      userData = new LevelModel({
        guildId,
        userId,
        username,
        xp: 0,
        totalXp: 0,
        level: 1
      });
    }
    
    // Update the XP
    userData.xp += xpToAdd;
    userData.totalXp += xpToAdd;
    userData.username = username; // Update username in case it changed
    
    // Save the updated data
    await userData.save();
    
    // Return the updated user data
    return userData;
  } catch (error) {
    console.error('Error updating user XP:', error);
    return null;
  }
}

// Update user level
async function updateUserLevel(guildId, userId, newLevel, currentXp) {
  try {
    await LevelModel.updateOne(
      { guildId, userId },
      { $set: { level: newLevel, xp: currentXp } }
    );
    return true;
  } catch (error) {
    console.error('Error updating user level:', error);
    return false;
  }
}

// Get leaderboard for a guild
async function getLeaderboard(guildId, limit = 10) {
  try {
    return await LevelModel.find({ guildId })
      .sort({ totalXp: -1 })
      .limit(limit)
      .lean();
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return [];
  }
}

// Reset a user's XP and level
async function resetUserData(guildId, userId) {
  try {
    await LevelModel.updateOne(
      { guildId, userId },
      { $set: { xp: 0, totalXp: 0, level: 1 } }
    );
    return true;
  } catch (error) {
    console.error('Error resetting user data:', error);
    return false;
  }
}

module.exports = {
  getUserData,
  updateUserXp,
  updateUserLevel,
  getLeaderboard,
  resetUserData
}