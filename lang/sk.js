import formatTimeToString from '../utils/formatTimeToString'

const general = {
  timeFormats: {
    days: {
      1: () => `deň`,
      2: () => `dni`,
      5: () => `dní`,
    },
    hours: {
      1: () => `hodina`,
      2: () => `hodiny`,
      5: () => `hodín`,
    },
    minutes: {
      1: () => `minúta`,
      2: () => `minúty`,
      5: () => `minút`,
    },
    seconds: {
      1: () => `sekunda`,
      2: () => `sekundy`,
      5: () => `sekúnd`,
    },
  },

  functionWords: {
    and: () => `a`,
  },

  errors: {
    turnstile: {
      unavailable: () => `nemožno kontaktovať Turnstile. prosím skúste to znova.`,
      noToken: () => `Turnstile token nebol poskytnutý. prosím skúste to znova.`,
      invalidResponse: () => `neplatná Turnstile odpoveď. prosím skúste to znova.`,
      keyUsedOrExpired: () => `Turnstile kľúč už bol použitý alebo vypršal. prosím skúste to znova.`,
    },
  },
}

export default {
  emails: {
    auth: {
      subject: () => `prihlasovací link`,
      text: (details) => `
        dobrý deň,

        môžete sa prihlásiť nasledujúcim kódom: ${details?.code}
        alebo nasledujúcim linkom: ${details?.link}

        ak ste tento email nevyžiadali, môžete ho kľudne ignorovať.

        ${process.env.APP_NAME}
      `,
    },
  },

  auth: {
    errors: {
      invalidEmail: () => `musíte zadať platný email.`,
      noVerificationToken: () => `nebol poskytnutý žiadny verifikačný token. prosím skúste to znova.`,
      verificationTokenUsedOrExpired: () => `verifikačný token už bol použitý alebo vypršal. prosím skúste to znova.`,
      invalidVerificationCode: () => `neplatný verifikačný kód. prosím skúste to znova.`,
      loginNeeded: () => `najprv sa prihláste prosím.`,
      
      ratelimits: {
        email: (details) => {
          if (!Number.parseInt(details?.duration)) return `príliš veľa žiadostí pre tento email. skúste to znova neskôr.`
          return `príliš veľa žiadostí pre tento email. skúste to znova o ${formatTimeToString(general.timeFormats, general.functionWords.and(), details?.duration * 1000)}.`
        },
        ip: (details) => {
          if (!Number.parseInt(details?.duration)) return `poslali ste príliš veľa žiadostí. skúste to znova neskôr.`
          return `poslali ste príliš veľa žiadostí. skúste to znova o ${formatTimeToString(general.timeFormats, general.functionWords.and(), details?.duration * 1000)}.`
        },
        code: () => `zadali ste príliš veľa zlých kódov. musíte požiadať o novú verifikáciu.`,
      },

      turnstile: general.errors.turnstile,
    },
  },

  settings: {
    errors: {
      invalidEmail: () => `musíte zadať platný email.`,
      emailTaken: (details) => `používateľ so zadaným emailom (${details?.newEmail}) už existuje.`,

      turnstile: general.errors.turnstile,
    },
  },

  stations: {
    errors: {
      noName: () => `musíte zadať meno.`,
      invalidOwner: () => `musíte zadať platný email vlastníka.`,
      ownerUserNotFound: (details) => `používateľ so zadaným emailom (${details?.newOwnerEmail}) neexistuje.`,

      turnstile: general.errors.turnstile,
    },
  },

  websocket: {
    keepalive: () => `beep`,
    dataSaved: (details) => `úspešne uložené dáta pre ${details?.meteostanica?.name}`,

    errors: {
      missingFields: () => `chýbajú dôležité polia: indoorTemp, indoorPressure, indoorHumidity, indoorAltitude, outdoorConnected, outdoorTemp, outdoorPressure, outdoorHumidity, outdoorAltitude`,
      invalidKey: (details) => `zadali ste neplatný websocket kľúč stanice (${details.key})`,
    },
  }
}