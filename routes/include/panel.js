import { Elysia } from 'elysia'

import { Eta } from "eta"
const eta = new Eta({ views: "./templates" })

import Auth from '../../utils/auth';
import Meteostanice from '../../utils/meteostanice';
import stations from './panel/stations';
import validateTurnstile from '../../utils/validateTurnstile';
import normalizeEmail from '../../utils/normalizeEmail';

export default (langName, lang) => new Elysia({ prefix: "/panel" })
  .use(stations(langName, lang))
  .get("/", async ({ cookie, redirect, set }) => {
    const token = cookie.session.value
    const session = await Auth.getSession(token)

    if (!session) {
      return redirect(`/${langName === "sk" ? `` : `${langName}/`}auth?error=loginNeeded`)
    }

    const user = Auth.getUser(session.email)
    const meteostanice = Meteostanice.getOwned(session.email)

    set.headers['content-type'] = 'text/html; charset=utf8'
    return eta.render(`${langName}/panel/index`, { user, meteostanice })
  })
  .get("/settings", async ({ cookie, redirect, set }) => {
    const token = cookie.session.value
    const session = await Auth.getSession(token)

    if (!session) {
      return redirect(`/${langName === "sk" ? `` : `${langName}/`}auth?error=loginNeeded`)
    }

    const user = Auth.getUser(session.email)

    set.headers['content-type'] = 'text/html; charset=utf8'
    return eta.render(`${langName}/panel/settings`, { siteKey: process.env.TURNSTILE_SITE_KEY, user })
  })
  .post("/settings", async ({ request, server, cookie, redirect, body, set }) => {
    const clientIP = request.headers.get('x-forwarded-for') ?? server.requestIP(request).address

    const token = cookie.session.value
    const session = await Auth.getSession(token)

    if (!session) {
      return redirect(`/${langName === "sk" ? `` : `${langName}/`}auth?error=loginNeeded`)
    }

    const user = Auth.getUser(session.email)

    const turnstileResponse = body?.["cf-turnstile-response"]
        
    if (!turnstileResponse) {
      set.headers['content-type'] = 'text/html; charset=utf8'
      return eta.render(`${langName}/panel/settings`, { siteKey: process.env.TURNSTILE_SITE_KEY, lang, user, error: "turnstile.noToken" })
    }

    const turnstileValid = await validateTurnstile(turnstileResponse, clientIP)
    
    if (!turnstileValid.success) {
      let errorMessage = `turnstile.unavailable`;

      if (turnstileValid["error-codes"]?.includes("invalid-input-response"))
      errorMessage = `turnstile.invalidResponse`

      if (turnstileValid["error-codes"]?.includes("timeout-or-duplicate"))
      errorMessage = `turnstile.keyUsedOrExpired`

      set.headers['content-type'] = 'text/html; charset=utf8'
      return eta.render(`${langName}/panel/settings`, { siteKey: process.env.TURNSTILE_SITE_KEY, lang, user, error: errorMessage })
    }

    const newName = body?.name
    const newEmail = body?.email

    if (!normalizeEmail(newEmail)) {
      set.headers['content-type'] = 'text/html; charset=utf8'
      return eta.render(`${langName}/panel/settings`, { siteKey: process.env.TURNSTILE_SITE_KEY, lang, user, error: "invalidEmail" })
    }

    const newEmailUser = Auth.getUser(newEmail)

    if (newEmailUser && session.email !== newEmail) {
      set.headers['content-type'] = 'text/html; charset=utf8'
      return eta.render(`${langName}/panel/settings`, { siteKey: process.env.TURNSTILE_SITE_KEY, lang, user, error: "emailTaken", errorDetails: { newEmail } })
    }

    Auth.editUser(session.email, newName, newEmail)

    Auth.removeSession(session.id)

    const newSession = await Auth.createSession(newEmail)
    
    cookie.session.value = newSession.token

    set.headers['content-type'] = 'text/html; charset=utf8'
    return redirect(`/${langName === "sk" ? `` : `${langName}/`}panel`)
  })
  .get("/deleteAccount", async ({ cookie, redirect, set }) => {
    const token = cookie.session.value
    const session = await Auth.getSession(token)

    if (!session) {
      return redirect(`/${langName === "sk" ? `` : `${langName}/`}auth?error=loginNeeded`)
    }

    const user = Auth.getUser(session.email)

    set.headers['content-type'] = 'text/html; charset=utf8'
    return eta.render(`${langName}/panel/deleteAccount`, { user })
  })