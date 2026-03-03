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
}

export default {
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
      ownerUserNotFound: (details) => `a user with the provided email (${details?.newOwnerEmail}) does not exist.`,

      turnstile: general.errors.turnstile,
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