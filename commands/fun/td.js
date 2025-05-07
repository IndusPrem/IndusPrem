const { EmbedBuilder } = require('discord.js');

const truthQuestions = [
    // Personal & Funny
    "What's the most embarrassing song you secretly love? 🎵",
    "What's your most used emoji in real conversations? 😊",
    "What's the longest you've gone without showering? 🚿",
    "What's your worst fashion mistake ever? 👔",
    "What's the most childish thing you still do? 🧸",
    "What's your most embarrassing nickname? 📛",
    "What's the silliest reason you've ever gotten into trouble? 😅",
    "What's your guilty pleasure TV show? 📺",
    "What's the weirdest food combination you enjoy? 🍽️",
    "What's your most embarrassing Google search? 🔍",
    
    // School/Work Related
    "Have you ever pretended to be sick to skip school/work? 🤒",
    "What's the worst excuse you've used to get out of something? 🤥",
    "Have you ever fallen asleep in class/meeting? 😴",
    "What's the biggest mistake you've made at work/school? 😬",
    "Have you ever had a crush on a teacher? 💝",
    
    // Social Life
    "Who's your secret crush in this server? ❤️",
    "What's the most awkward date you've been on? 🌹",
    "What's the worst lie you've ever told your best friend? 🤫",
    "What's the most embarrassing text you've sent to the wrong person? 📱",
    "What's your biggest social media regret? 📸",
    
    // Family Related
    "What's the worst trouble you got into with your parents? 👪",
    "What's something you've never told your parents? 🤐",
    "What's the most expensive thing you've broken? 💰",
    "What's the worst thing you've blamed on your sibling? 👥",
    "What's your most embarrassing childhood memory? 👶",
    
    // Random Fun
    "What's your worst dancing moment? 💃",
    "Have you ever worn clothes inside out in public? 👕",
    "What's the longest you've gone without sleep? 😪",
    "What's the weirdest place you've fallen asleep? 🛏️",
    "What's your most irrational fear? 😱",
    
    // Digital Life
    "What's your most embarrassing autocorrect fail? ⌨️",
    "What's the longest time you've spent on social media in one sitting? 📱",
    "What's the worst selfie you've ever taken? 🤳",
    "What's your most regrettable post online? 💻",
    "What's your most used app and how many hours daily? 📊",
    
    // Food Related
    "What's the most you've eaten in one sitting? 🍽️",
    "Have you ever eaten food that fell on the floor? 😋",
    "What's the strangest thing you've eaten? 🍴",
    "What's your weird food habit? 🥘",
    "Have you ever stolen someone's food from the fridge? 🍱",
    
    // Habits & Quirks
    "What's your weirdest habit? 🤪",
    "What's the longest you've worn the same clothes? 👔",
    "What's your worst bathroom experience? 🚽",
    "Do you talk to yourself? What do you say? 🗣️",
    "What's your weirdest collection? 🏺",
    
    // Past Events
    "What's your biggest fashion regret? 👗",
    "What's the worst haircut you've ever had? 💇",
    "What's your most cringe-worthy memory? 😖",
    "What's the most trouble you've been in? ⚠️",
    "What's your biggest impulse purchase? 🛍️",
    
    // Preferences
    "What's your secret talent that you're embarrassed about? 🎭",
    "What's your worst habit in public? 🏃",
    "What's your biggest pet peeve? 😤",
    "What's your most used excuse? 🤷",
    "What's your go-to fake name? 🎭",
    
    // Relationships
    "Who was your first crush? 💘",
    "What's the worst date you've been on? 🌹",
    "What's your worst rejection story? 💔",
    "What's your most embarrassing romantic moment? 💝",
    "What's the worst pickup line you've used? 😏",
    
    // Digital Secrets
    "What's your most embarrassing phone background? 📱",
    "What's the worst thing in your search history? 🔍",
    "What's your most used emoji combination? 😊",
    "What's your worst autocorrect fail story? ⌨️",
    "What's your guilty pleasure website? 💻",
    
    // School Days
    "What's your most embarrassing school photo? 📸",
    "What's the worst grade you've hidden from your parents? 📝",
    "What's your funniest school memory? 🎒",
    "What's the worst trouble you got into at school? 😈",
    "What's your most embarrassing teacher interaction? 👨‍🏫",
    
    // Random Confessions
    "What's the longest you've gone without changing your sheets? 🛏️",
    "What's your worst cooking disaster? 👨‍🍳",
    "What's your most embarrassing sports moment? ⚽",
    "What's your secret hidden talent? 🎪",
    "What's your worst karaoke performance? 🎤",
    
    // More Personal
    "What's your most embarrassing clothing malfunction? 👕",
    "What's your worst public transport story? 🚌",
    "What's your most embarrassing family gathering moment? 👨‍👩‍👦",
    "What's your biggest regret from last year? 📅",
    "What's your most embarrassing doctor visit? 👨‍⚕️",
    
    // Social Media
    "What's your most embarrassing tagged photo? 📸",
    "What's your worst social media post? 📱",
    "What's your most regrettable comment online? 💭",
    "What's your most embarrassing video call moment? 🎥",
    "What's your worst online shopping mistake? 🛒",
    
    // Miscellaneous
    "What's your most embarrassing auto-correct fail? ⌨️",
    "What's your worst case of mistaken identity? 👥",
    "What's your most embarrassing moment with technology? 💻",
    "What's your worst wardrobe malfunction? 👚",
    "What's your most embarrassing moment in front of a crush? ❤️",
    
    // Final Set
    "What's your worst brain freeze moment? 🧠",
    "What's your most embarrassing delivery order? 📦",
    "What's your worst attempt at lying? 🤥",
    "What's your most embarrassing gym moment? 💪",
    "What's your worst attempt at cooking? 🍳",
    "What's your most embarrassing weather-related incident? ⛈️",
    "What's your worst attempt at a DIY project? 🔨",
    "What's your most embarrassing moment with an animal? 🐾",
    "What's your worst attempt at speaking another language? 🗣️",
    "What's your most embarrassing moment in an elevator? 🛗"
];

const dareQuestions = [
    // Social Media Dares
    "Change your discord profile picture to a potato for 24 hours 🥔",
    "Post your oldest selfie on social media 📸",
    "Send a screenshot of your most recent emoji usage 😊",
    "Make a funny TikTok-style dance video 💃",
    "Post a childhood photo as your profile picture 👶",
    
    // Message Dares
    "Send a voice message singing your favorite song 🎤",
    "Text your crush with a cheesy pickup line 💕",
    "Write everything backwards for the next 5 messages ⌛",
    "Speak only in emojis for the next 10 minutes 😎",
    "Send a message in another channel speaking only in emojis 🤪",
    
    // Creative Dares
    "Draw a portrait of someone in the server and share it 🎨",
    "Write a short poem about the last person who sent a message 📝",
    "Create a meme about someone in the server 🖼️",
    "Make up a short song about your day and sing it 🎵",
    "Create your superhero alter ego and describe their powers 🦸",
    
    // Physical Dares
    "Do 10 jumping jacks right now 🏃",
    "Balance a spoon on your nose for 30 seconds 🥄",
    "Put an ice cube down your shirt and let it melt 🧊",
    "Do your best impression of a chicken 🐔",
    "Show us your best dance moves 💃",
    
    // Food Related
    "Eat a spoonful of mustard/ketchup 🥄",
    "Make a sandwich with random ingredients and eat it 🥪",
    "Drink water while standing upside down 🚰",
    "Eat a snack without using your hands 🍪",
    "Mix three beverages together and drink it 🥤",
    
    // Social Dares
    "Call a friend and speak in an accent 📞",
    "DM someone and only use song lyrics to communicate 🎵",
    "Tell a joke in a public channel 😄",
    "Give a compliment to the next 3 people who send messages 💝",
    "Start a conversation with a random emoji 😊",
    
    // Photo Dares
    "Take a silly selfie and make it your profile picture 📸",
    "Recreate your favorite meme and share it 🖼️",
    "Take a photo with a funny face and send it 😜",
    "Share your worst photo in your gallery 📱",
    "Take a picture doing your best superhero pose 🦸",
    
    // Voice Dares
    "Record yourself telling a story in a different accent 🎤",
    "Sing happy birthday in a voice message 🎂",
    "Make animal sounds for 30 seconds 🐮",
    "Record yourself reading a message in a news anchor voice 📰",
    "Do your best impression of a famous person 🎭",
    
    // Gaming Dares
    "Play your next game with inverted controls 🎮",
    "Change your gaming username to something silly for a day 🕹️",
    "Play a game using only your non-dominant hand 🖱️",
    "Stream yourself playing a game for 10 minutes 🎥",
    "Challenge someone to a friendly 1v1 match ⚔️",
    
    // Discord Server Dares
    "Change your nickname to something funny for 24 hours 📛",
    "Type everything in CAPS for the next hour ⌨️",
    "React to the last 10 messages with random emojis 👍",
    "Start a silly poll in the general chat 📊",
    "Create a new channel emoji 😊",
    
    // Creative Writing
    "Write a short story using only emojis 📝",
    "Create a haiku about your favorite game 🎮",
    "Write a dramatic movie synopsis about your day 🎬",
    "Make up a conspiracy theory about the server 🕵️",
    "Write a commercial script for your favorite snack 📺",
    
    // Role Play
    "Act like your favorite video game character for 10 minutes 🎭",
    "Pretend to be the server bot for 5 messages 🤖",
    "Speak like a medieval knight for 15 minutes ⚔️",
    "Be a news reporter and report server happenings 📰",
    "Talk like a pirate for the next 10 messages 🏴‍☠️",
    
    // Art Challenges
    "Draw your favorite emojis and share them 🎨",
    "Create a logo for the server using MS Paint 🖼️",
    "Make pixel art of your favorite game character 👾",
    "Design a new server banner 🎌",
    "Draw yourself as an anime character 📝",
    
    // Musical
    "Create a short rap about the server 🎤",
    "Make a beat using only mouth sounds 🎵",
    "Sing your messages for the next 5 minutes 🎼",
    "Create a jingle for your favorite command 🎹",
    "Share your most embarrassing Spotify playlist 🎧",
    
    // Physical Challenges
    "Do a plank during your next voice chat 💪",
    "Show us your best yoga pose 🧘",
    "Do 5 pushups between messages 🏋️",
    "Balance a book on your head while typing 📚",
    "Spin in your chair 3 times before each message 💫",
    
    // Random Fun
    "Wear your clothes backwards for an hour 👕",
    "Put socks on your hands for 10 minutes 🧦",
    "Make a hat out of household items 🎩",
    "Wrap yourself in toilet paper and take a photo 🧻",
    "Make a mustache with something that's not a marker 👨",
    
    // Server Interaction
    "Start a virtual dance party in voice chat 💃",
    "Host an impromptu typing race ⌨️",
    "Create a treasure hunt with server emojis 🗺️",
    "Start a word chain game in chat 🔤",
    "Organize a quick server talent show 🎪",
    
    // Final Set
    "Write a love letter to your favorite food 💌",
    "Create a superhero origin story for the server 🦸",
    "Make up a new server rule and try to convince others it's real 📜",
    "Create a dramatic movie trailer voice over for your day 🎬",
    "Design an album cover for your life 💿",
    "Invent a new dance move and name it 🕺",
    "Create a commercial for the worst product ever 📺",
    "Write a breaking news story about the server 📰",
    "Make up a new holiday and explain its traditions 🎉",
    "Create a new sport and explain its rules 🏅"
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('td')
        .setDescription('Play Truth or Dare!'),
        
    async execute(interaction) {
        const isTruth = Math.random() < 0.5;
        const question = isTruth 
            ? truthQuestions[Math.floor(Math.random() * truthQuestions.length)]
            : dareQuestions[Math.floor(Math.random() * dareQuestions.length)];

        const embed = new EmbedBuilder()
            .setColor(isTruth ? '#4287f5' : '#f54242')
            .setTitle(`${isTruth ? '🤔 Truth' : '🎯 Dare'} Time!`)
            .setDescription(question)
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
            .setFooter({ 
                text: `Requested by ${interaction.user.username}`,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true })
            })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};