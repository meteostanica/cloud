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

  dateFormats: {
    months: {
      [`01`]: () => `január`,
      [`02`]: () => `február`,
      [`03`]: () => `marec`,
      [`04`]: () => `apríl`,
      [`05`]: () => `máj`,
      [`06`]: () => `jún`,
      [`07`]: () => `júl`,
      [`08`]: () => `august`,
      [`09`]: () => `september`,
      [`10`]: () => `október`,
      [`11`]: () => `november`,
      [`12`]: () => `december`,
    }
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

    history: {
      properties: {
        indoorTemp: () => `${icons.tempIcon()} vnutorná teplota`,
        indoorPressure: () => `${icons.pressureIcon()} vnutorný tlak`,
        indoorHumidity: () => `${icons.humidityIcon()} vnutorná vlhkosť`,

        outdoorConnected: () => `${icons.bluetoothConnectionIcon()} pripojenie externej jednotky`,
        outdoorTemp: () => `${icons.tempIcon()} vonkajšia teplota`,
        outdoorPressure: () => `${icons.pressureIcon()} vonkajší tlak`,
        outdoorHumidity: () => `${icons.humidityIcon()} vonkajšia vlhkosť`,
      },
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