const { SlashCommandBuilder } = require('discord.js');

const truths = [
  "What’s your biggest fear?",
  "Have you ever cheated in an exam?",
  "Who was your first crush?",
  "What’s a secret you’ve never told anyone?",
  "What is something illegal you’ve done?",
  "Have you ever lied to your parents?",
  "What’s the most embarrassing thing you’ve done?",
  "What’s your guilty pleasure?",
  "What’s your weirdest habit?",
  "What’s a lie you told recently?",
  "Have you ever stalked someone on social media?",
  "What’s your biggest insecurity?",
  "What’s something you wish you could change about yourself?",
  "What’s the worst thing you’ve done to a friend?",
  "Have you ever had a crush on a teacher?",
  "What’s the weirdest dream you’ve had?",
  "What’s the most childish thing you still do?",
  "What’s your most embarrassing nickname?",
  "Have you ever broken something and blamed someone else?",
  "What’s a secret you kept from your best friend?",
  "Have you ever faked being sick to skip school?",
  "What’s the biggest mistake you’ve made?",
  "What’s your most irrational fear?",
  "Have you ever pretended to like a gift you hated?",
  "Have you ever lied to your crush?",
  "What’s your worst habit?",
  "Do you talk in your sleep?",
  "Have you ever been caught talking to yourself?",
  "What’s the dumbest thing you’ve ever done?",
  "Do you sing in the shower?",
  "What’s your most awkward moment?",
  "Have you ever sent a message to the wrong person?",
  "Have you ever peed your pants?",
  "What’s the silliest thing you’re afraid of?",
  "Do you have a fake social media account?",
  "What’s the longest you’ve gone without showering?",
  "What’s a food you pretend to like but actually hate?",
  "Have you ever Googled yourself?",
  "Do you still sleep with a stuffed toy?",
  "What’s your most embarrassing photo?",
  "Have you ever cried in public?",
  "What’s the last lie you told?",
  "Do you sing or dance when you're alone?",
  "What’s a rumor you helped spread?",
  "Have you ever been rejected?",
  "What’s your weirdest talent?",
  "Have you ever been caught sneaking out?",
  "Do you talk to your pets like they're humans?",
  "What’s the most cringe thing you’ve posted online?",
  "If you had to confess one secret right now, what would it be?"
];

const dares = [
  "Do 10 push-ups.",
  "Speak in a British accent for the next 5 minutes.",
  "Do your best chicken dance.",
  "Send a funny selfie to the group.",
  "Text your crush ‘I like you 😳’.",
  "Act like a monkey for 1 minute.",
  "Say the alphabet backwards.",
  "Eat a spoonful of something spicy.",
  "Sing your favorite song out loud.",
  "Dance with no music for 30 seconds.",
  "Change your nickname to something silly for 10 minutes.",
  "Send a meme without context.",
  "Imitate your favorite cartoon character.",
  "Wear socks on your hands for the next 5 minutes.",
  "Let someone send a message from your phone.",
  "Call a friend and say you love pineapple on pizza.",
  "Draw a mustache on your face with a pen.",
  "Balance a book on your head and walk.",
  "Do your best evil laugh.",
  "Send the last photo in your gallery.",
  "Record yourself singing badly and post it.",
  "Pretend you’re a robot for 2 minutes.",
  "Speak only in emojis for 3 minutes.",
  "Spin around 10 times and try to walk straight.",
  "Do 20 jumping jacks.",
  "Show your browser history.",
  "Say 3 embarrassing facts about yourself.",
  "Try to touch your toes for 30 seconds.",
  "Take a weird selfie and make it your profile picture.",
  "Pretend to cry for 1 minute.",
  "Share a cringy childhood story.",
  "Let someone else write your next message.",
  "Act like a cat for 1 minute.",
  "Attempt to lick your elbow.",
  "Text your mom something weird.",
  "Make a weird face and hold it for 10 seconds.",
  "Act like you're in love with your chair.",
  "Talk without using the letter ‘e’ for 1 minute.",
  "Take a sip of water while upside down.",
  "Sing the chorus of a song using only animal sounds.",
  "Say something romantic to a random person.",
  "Speak like a baby for 2 minutes.",
  "Show your last five emojis.",
  "Write your name with your non-dominant hand.",
  "Eat a lemon slice.",
  "Make a weird animal noise every time someone talks for 5 minutes.",
  "Pretend you're a news reporter reporting a fake story.",
  "Do your best runway walk.",
  "Try to sell something nearby as if you're a salesperson.",
  "Share an old embarrassing video or photo."
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('td') // ✅ new name
    .setDescription('Play Truth or Dare!')
    .addStringOption(option =>
      option.setName('choice')
        .setDescription('Choose truth or dare')
        .setRequired(true)
        .addChoices(
          { name: 'Truth', value: 'truth' },
          { name: 'Dare', value: 'dare' },
        )),

  async execute(interaction) {
    const choice = interaction.options.getString('choice');
    const list = choice === 'truth' ? truths : dares;
    const prompt = list[Math.floor(Math.random() * list.length)];

    await interaction.reply(`${interaction.user}, here’s your ${choice}: **${prompt}**`);
  }
};
