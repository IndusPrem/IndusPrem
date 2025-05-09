// level-utils.js
// XP settings
const XP_SETTINGS = {
  minXpPerMessage: 15,
  maxXpPerMessage: 25,
  cooldownSeconds: 60,  // How often a user can earn XP (in seconds)
};

// Set up the cooldown collection to track when users can earn XP again
const cooldowns = new Map();

// Calculate XP required for a given level
function xpForLevel(level) {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

// Calculate level based on total XP
function calculateLevel(xp) {
  let level = 1;
  
  while (xp >= xpForLevel(level + 1)) {
    level++;
  }
  
  return level;
}

// Get XP needed for next level
function getXpForNextLevel(level) {
  return xpForLevel(level + 1) - xpForLevel(level);
}

// Check if user is on cooldown
function isOnCooldown(guildId, userId) {
  const cooldownKey = `${guildId}-${userId}`;
  
  if (cooldowns.has(cooldownKey)) {
    const cooldownEnd = cooldowns.get(cooldownKey);
    if (Date.now() < cooldownEnd) {
      return true; // User is still on cooldown
    }
  }
  
  return false;
}

// Set user on cooldown
function setUserCooldown(guildId, userId) {
  const cooldownKey = `${guildId}-${userId}`;
  cooldowns.set(cooldownKey, Date.now() + (XP_SETTINGS.cooldownSeconds * 1000));
}

// Generate random XP for a message
function generateXpForMessage() {
  return Math.floor(
    Math.random() * (XP_SETTINGS.maxXpPerMessage - XP_SETTINGS.minXpPerMessage + 1) + 
    XP_SETTINGS.minXpPerMessage
  );
}

module.exports = {
  XP_SETTINGS,
  xpForLevel,
  calculateLevel,
  getXpForNextLevel,
  isOnCooldown,
  setUserCooldown,
  generateXpForMessage
}