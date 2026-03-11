import formatTimeToString from '../utils/formatTimeToString'

const general = {
  timeFormats: {
    days: {
      1: () => `day`,
      2: () => `days`,
    },
    hours: {
      1: () => `hour`,
      2: () => `hours`,
    },
    minutes: {
      1: () => `minute`,
      2: () => `minutes`,
    },
    seconds: {
      1: () => `second`,
      2: () => `seconds`,
    },
  },

  dateFormats: {
    months: {
      [`01`]: () => `January`,
      [`02`]: () => `February`,
      [`03`]: () => `March`,
      [`04`]: () => `April`,
      [`05`]: () => `May`,
      [`06`]: () => `June`,
      [`07`]: () => `July`,
      [`08`]: () => `August`,
      [`09`]: () => `September`,
      [`10`]: () => `October`,
      [`11`]: () => `November`,
      [`12`]: () => `December`,
    }
  },

  functionWords: {
    and: () => `and`,
  },

  errors: {
    turnstile: {
      unavailable: () => `cannot connect to Turnstile. please try again.`,
      noToken: () => `Turnstile token was not provided. please try again.`,
      invalidResponse: () => `invalid Turnstile response. please try again.`,
      keyUsedOrExpired: () => `Turnstile key already used or expired. please try again.`
    },
  },

  adjectives: () => [
    "adorable", "adventurous", "agreeable", "alert", "alive", "amused", 
    "angry", "annoyed", "annoying", "anxious", "arrogant", "ashamed", 
    "attractive", "average", "awful", "bad", "beautiful", "better", 
    "bewildered", "black", "blue", "blue-eyed", "blushing", "bored", 
    "brainy", "brave", "breakable", "bright", "busy", "calm", "careful", 
    "cautious", "charming", "cheerful", "clean", "clear", "clever", 
    "cloudy", "clumsy", "colorful", "combative", "comfortable", "concerned", 
    "condemned", "confused", "cooperative", "courageous", "crazy", "creepy", 
    "crowded", "curious", "cute", "dangerous", "dark", "dazzling", 
    "deadpan", "delightful", "difficult", "distinct", "disturbed", "dizzy", 
    "doubtful", "drab", "dull", "eager", "easy", "elated", "elegant", 
    "embarrassed", "enchanting", "encouraging", "energetic", "enthusiastic", 
    "envious", "excited", "expensive", "exuberant", "fair", "faithful", 
    "famous", "fancy", "fantastic", "fast", "filthy", "fine", "foolish", 
    "fragile", "frail", "frantic", "friendly", "frightened", "funny", 
    "gentle", "gifted", "glamorous", "gleaming", "glorious", "good", 
    "gorgeous", "graceful", "grieved", "grotesque", "grumpy", "handsome", 
    "happy", "healthy", "helpful", "helpless", "hilarious", "homely", 
    "horrible", "hungry", "hurt", "ill", "important", "impossible", 
    "inexpensive", "innocent", "inquisitive", "intelligent", "interested", 
    "itchy", "jealous", "jittery", "jolly", "joyous", "kind", "lazy", 
    "light", "lively", "lonely", "long", "lovely", "lucky", "magnificent", 
    "misty", "modern", "motionless", "muddy", "mushy", "mysterious", 
    "nasty", "naughty", "nervous", "nice", "nutty", "obedient", "obnoxious", 
    "odd", "open", "outrageous", "outstanding", "panicky", "perfect", 
    "plain", "pleasant", "poised", "polite", "powerful", "precious", 
    "prickly", "proud", "puzzled", "quaint", "real", "relieved", "repulsive", 
    "rich", "scary", "selfish", "shiny", "shy", "silly", "sleepy", "smiling", 
    "smoggy", "sore", "sparkling", "splendid", "spotless", "stormy", 
    "strange", "stupid", "successful", "super", "talented", "tame", "tender", 
    "tense", "terrible", "thankful", "thoughtful", "thoughtless", "tired", 
    "tough", "troubled", "uninterested", "unsightly", "unusual", "upset", 
    "uptight", "vast", "victorious", "vivacious", "wandering", "weary", 
    "wicked", "wide-eyed", "wild", "witty", "worried", "worrisome", "wrong", 
    "zany", "zealous"
  ],

  nouns: () => [
    "actor", "airplane", "airport", "alarm", "alligator", "alphabet", 
    "ambulance", "animal", "answer", "ant", "apple", "appliance", 
    "apron", "arch", "arm", "army", "arrow", "ashtray", "asteroid", 
    "author", "avocado", "baby", "back", "balloon", "banana", "band", 
    "bank", "barber", "base", "basket", "basketball", "bat", "bath", 
    "beach", "bear", "beard", "bed", "bee", "beef", "beetle", "bell", 
    "belt", "bench", "beret", "berry", "bicycle", "bike", "bird", 
    "birthday", "bite", "block", "boat", "book", "boot", "border", 
    "bottle", "boundary", "box", "boy", "brake", "bread", "bridge", 
    "bronco", "brother", "brush", "bubble", "bucket", "building", 
    "bulb", "bunny", "bus", "butterfly", "button", "cabbage", "cactus", 
    "cake", "calculator", "calendar", "camel", "camera", "camp", "candle", 
    "canoe", "canvas", "cap", "caption", "car", "card", "carpenter", 
    "carriage", "carrot", "cart", "castle", "cat", "cattle", "celery", 
    "cello", "cement", "chain", "chair", "chalk", "channel", "cheese", 
    "cherry", "chess", "chicken", "children", "chimpanzee", "chin", 
    "church", "city", "clam", "clock", "cloth", "cloud", "clover", 
    "club", "coach", "coal", "coast", "coat", "cobweb", "coil", "collar", 
    "color", "comet", "compass", "computer", "conditioner", "cord", 
    "cork", "corn", "couch", "country", "cow", "crab", "crack", "crate", 
    "crayon", "cricket", "crocodile", "crow", "crown", "crust", "cup", 
    "curtain", "cushion", "cylinder", "dog", "donkey", "door", "dragon", 
    "drain", "drawer", "dress", "drop", "duck", "dust", "eagle", "ear", 
    "earth", "egg", "eggplant", "elbow", "elephant", "engine", "eye", 
    "face", "factory", "fairy", "family", "fan", "farm", "feather", 
    "feast", "fence", "field", "flag", "flower", "flute", "fly", "fog", 
    "forest", "fork", "fountain", "frog", "fruit", "furniture", "garage", 
    "garden", "gate", "gemstone", "ghost", "giraffe", "glass", "glove", 
    "goat", "gold", "goose", "gorilla", "grape", "grass", "guitar", 
    "hair", "hall", "hat", "helicopter", "helmet", "honey", "horn", 
    "horse", "hospital", "house", "island", "jacket", "jar", "jellyfish", 
    "kangaroo", "kettle", "key", "keyboard", "king", "kitchen", "kite", 
    "kitten", "lamp", "leaf", "library", "lighthouse", "lion", "lizard", 
    "lock", "lunch", "magnet", "map", "mask", "melon", "monkey", "moon", 
    "mountain", "mouse", "mouth", "nail", "necklace", "needle", "nest", 
    "nose", "notebook", "ocean", "orange", "owl", "paint", "pants", 
    "paper", "parrot", "pencil", "piano", "pillow", "pizza", "planet", 
    "plant", "pocket", "potato", "prison", "pumpkin", "rabbit", "rain", 
    "rainbow", "ring", "river", "robot", "rocket", "root", "rope", 
    "sail", "school", "scissors", "sea", "shoe", "sky", "snail", "snake", 
    "snow", "soap", "sock", "spoon", "star", "sun", "table", "tiger", 
    "tomato", "tooth", "train", "tree", "umbrella", "valley", "vase", 
    "wagon", "wall", "whale", "wheel", "window", "wing", "wolf", "worm", 
    "zebra", "zoo"
  ],

  generateName: () => {
    const adjectives = general.adjectives()
    const nouns = general.nouns()

    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

    // Capitalize first letters and return
    const cappedAdjective = randomAdjective.charAt(0).toUpperCase() + randomAdjective.slice(1);
    const cappedNoun = randomNoun.charAt(0).toUpperCase() + randomNoun.slice(1);

    return `${cappedAdjective} ${cappedNoun}`;
  }
}

const icons = {
  tempIcon: () => `
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0" />
        </svg>
    `,

  pressureIcon: () => `
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m12 14l4-4M3.34 19a10 10 0 1 1 17.32 0" />
        </svg>
    `,

  humidityIcon: () => `
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5S5 13 5 15a7 7 0 0 0 7 7" />
        </svg>
    `,

  bluetoothConnectionIcon: () => `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m7 7l10 10l-5 5V2l5 5L7 17m11-5h3M3 12h3" />
        </svg>
    `
}

export default {
  general,
  icons,
  
  emails: {
    auth: {
      subject: () => `login link`,
      text: (details) => `
        hi!

        you can login using the following code: ${details?.code}
        or the following link: ${details?.link}

        if you did not request this email, feel free to ignore it.

        ${process.env.APP_NAME}
      `,
    },
  },

  auth: {
    errors: {
      invalidEmail: () => `you need to provide a valid email.`,
      noVerificationToken: () => `verification token was not provided. please try again.`,
      verificationTokenUsedOrExpired: () => `verification token already used or expired. please try again.`,
      invalidVerificationCode: () => `invalid verification code. please try again.`,
      loginNeeded: () => `please log in first.`,

      ratelimits: {
        email: (details) => {
          if (!Number.parseInt(details?.duration)) return `too many requests for this email. try again later.`
          return `too many requests for this email. try again in ${formatTimeToString(general.timeFormats, general.functionWords.and(), details?.duration * 1000)}.`
        },
        ip: (details) => {
          if (!Number.parseInt(details?.duration)) return `you made too many requests. try again later.`
          return `you made too many requests. try again in ${formatTimeToString(general.timeFormats, general.functionWords.and(), details?.duration * 1000)}.`
        },
        code: () => `you entered too many wrong codes. you need to request a new verification.`,
      },

      turnstile: general.errors.turnstile,
    },
  },

  settings: {
    errors: {
      invalidEmail: () => `you need to provide a valid email.`,
      emailTaken: (details) => `a user with the provided email (${details?.newEmail}) already exists.`,

      turnstile: general.errors.turnstile,
    },
  },

  stations: {
    errors: {
      noName: () => `you need to provide a name.`,
      invalidOwner: () => `you need to provide a valid owner email.`,
      ownerUserNotFound: (details) => `no user with the provided email (${details?.newOwnerEmail}) exists.`,
      invalidSubowner: () => `one (or more) of the subowner emails is invalid.`,
      subownerUserNotFound: (details) => `no user with the provided email (${details?.subownerEmail}) exists.`,

      turnstile: general.errors.turnstile,
    },

    history: {
      properties: {
        indoorTemp: () => `${icons.tempIcon()} indoor temperature`,
        indoorPressure: () => `${icons.pressureIcon()} indoor pressure`,
        indoorHumidity: () => `${icons.humidityIcon()} indoor humidity`,

        outdoorConnected: () => `${icons.bluetoothConnectionIcon()} external unit connection`,
        outdoorTemp: () => `${icons.tempIcon()} outdoor temperature`,
        outdoorPressure: () => `${icons.pressureIcon()} outdoor pressure`,
        outdoorHumidity: () => `${icons.humidityIcon()} outdoor humidity`,
      },
    },
  },

  websocket: {
    keepalive: () => `free ferris`,
    dataSaved: (details) => `successfully saved data for ${details?.meteostanica?.name}`,

    errors: {
      missingFields: () => `missing required fields: indoorTemp, indoorPressure, indoorHumidity, indoorAltitude, outdoorConnected, outdoorTemp, outdoorPressure, outdoorHumidity, outdoorAltitude`,
      invalidKey: (details) => `invalid station websocket key (${details.key}) provided`,
    },
  }
}