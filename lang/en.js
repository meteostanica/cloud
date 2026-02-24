export default {
  "timeFormats": {
    "days": {
      "1": "day",
      "2": "days"
    },
    "hours": {
      "1": "hour",
      "2": "hours"
    },
    "minutes": {
      "1": "minute",
      "2": "minutes"
    },
    "seconds": {
      "1": "second",
      "2": "seconds"
    }
  },

  "functionWords": {
    "and": "and"
  },

  "emails": {
    "auth": {
      "subject": "login link",
      "text": (code, link) => `
        hi!

        you can login using the following code: ${code}
        or the following link: ${link}

        if you did not request this email, feel free to ignore it.

        meteostanica
      `
    }
  },

  "auth": {
    "errors": {
      "invalidEmail": "you need to provide a valid email.",
      "noVerificationToken": "no verification token provided. please try again.",
      "verificationTokenUsedOrExpired": "verification token already used or expired. please try again.",
      "invalidVerificationCode": "invalid verification code. please try again.",
      "loginNeeded": "please log in first.",

      "turnstile": {
        "unavailable": "cannot connect to Turnstile. please try again.",
        "noToken": "Turnstile token was not provided. please try again.",
        "invalidResponse": "invalid Turnstile response. please try again.",
        "keyUsedOrExpired": "Turnstile key already used or expired. please try again."
      },

      "ratelimits": {
        "email": "too many requests for this email. try again later.",
        "ip": "you made too many requests. try again later.",
        "code": "you entered too many wrong codes. try again later."
      }
    }
  }
}