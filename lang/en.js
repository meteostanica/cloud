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
      ownerUserNotFound: (details) => `a user with the provided email (${details?.newOwnerEmail}) does not exist.`,

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