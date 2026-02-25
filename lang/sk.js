export default {
  "timeFormats": {
    "days": {
      "1": "deň",
      "2": "dni",
      "5": "dní"
    },
    "hours": {
      "1": "hodina",
      "2": "hodiny",
      "5": "hodín"
    },
    "minutes": {
      "1": "minúta",
      "2": "minúty",
      "5": "minút"
    },
    "seconds": {
      "1": "sekunda",
      "2": "sekundy",
      "5": "sekúnd"
    }
  },

  "functionWords": {
    "and": "a"
  },

  "emails": {
    "auth": {
      "subject": "prihlasovací link",
      "text": (code, link) => `
        dobrý deň,

        môžete sa prihlásiť nasledujúcim kódom: ${code}
        alebo nasledujúcim linkom: ${link}

        ak ste tento email nevyžiadali, môžete ho kľudne ignorovať.

        meteostanica
      `
    }
  },

  "auth": {
    "errors": {
      "invalidEmail": "musíte zadať platný email.",
      "noVerificationToken": "nebol poskytnutý žiadny verifikačný token. prosím skúste to znova.",
      "verificationTokenUsedOrExpired": "verifikačný token už bol použitý alebo vypršal. prosím skúste to znova.",
      "invalidVerificationCode": "neplatný verifikačný kód. prosím skúste to znova.",
      "loginNeeded": "najprv sa prihláste prosím.",

      "turnstile": {
        "unavailable": "nemožno kontaktovať Turnstile. prosím skúste to znova.",
        "noToken": "Turnstile token nebol poskytnutý. prosím skúste to znova.",
        "invalidResponse": "neplatná Turnstile odpoveď. prosím skúste to znova.",
        "keyUsedOrExpired": "Turnstile kľúč už bol použitý alebo vypršal. prosím skúste to znova."
      },

      "ratelimits": {
        "email": "príliš veľa žiadostí pre tento email. skúste to znova neskôr.",
        "ip": "poslali ste príliš veľa žiadostí. skúste to znova neskôr.",
        "code": "zadali ste príliš veľa zlých kódov. skúste to znova neskôr."
      }
    }
  },

  settings: {
    errors: {
      invalidEmail: "musíte zadať platný email.",

      turnstile: {
        "unavailable": "nemožno kontaktovať Turnstile. prosím skúste to znova.",
        "noToken": "Turnstile token nebol poskytnutý. prosím skúste to znova.",
        "invalidResponse": "neplatná Turnstile odpoveď. prosím skúste to znova.",
        "keyUsedOrExpired": "Turnstile kľúč už bol použitý alebo vypršal. prosím skúste to znova."
      }
    }
  },

  stations: {
    errors: {
      noName: "musíte zadať meno.",
      invalidOwner: "musíte zadať platný email vlastníka.",
      ownerUserNotFound: "používateľ so zadaným emailom neexistuje.",

      turnstile: {
        "unavailable": "nemožno kontaktovať Turnstile. prosím skúste to znova.",
        "noToken": "Turnstile token nebol poskytnutý. prosím skúste to znova.",
        "invalidResponse": "neplatná Turnstile odpoveď. prosím skúste to znova.",
        "keyUsedOrExpired": "Turnstile kľúč už bol použitý alebo vypršal. prosím skúste to znova."
      }
    }
  }
}