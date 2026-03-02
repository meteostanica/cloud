import { Elysia } from 'elysia'

import { Eta } from "eta"
const eta = new Eta({ views: "./templates" })

import Auth from '../../../utils/auth';
import Meteostanice from '../../../utils/meteostanice';
import validateTurnstile from '../../../utils/validateTurnstile';
import normalizeEmail from '../../../utils/normalizeEmail';

export default (langName, lang) => new Elysia({ prefix: "/stations" })
  .get("/", async ({ cookie, redirect, set }) => {
    const token = cookie.session.value
    const session = await Auth.getSession(token)

    if (!session) {
      return redirect(`/${langName === "sk" ? `` : `${langName}/`}auth?error=loginNeeded`)
    }

    const user = Auth.getUser(session.email)
    const meteostanice = Meteostanice.getOwned(session.email)

    set.headers['content-type'] = 'text/html; charset=utf8'
    return eta.render(`${langName}/panel/stations/index`, { user, meteostanice })
  })
  .get("/add", async ({ cookie, redirect, set }) => {
    const token = cookie.session.value
    const session = await Auth.getSession(token)

    if (!session) {
      return redirect(`/${langName === "sk" ? `` : `${langName}/`}auth?error=loginNeeded`)
    }

    const user = Auth.getUser(session.email)

    set.headers['content-type'] = 'text/html; charset=utf8'
    return eta.render(`${langName}/panel/stations/add`, { siteKey: process.env.TURNSTILE_SITE_KEY, user })
  })
  .post("/add", async ({ request, server, cookie, redirect, body, set }) => {
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
        return eta.render(`${langName}/panel/stations/add`, { siteKey: process.env.TURNSTILE_SITE_KEY, lang, user, error: "turnstile.noToken" })
    }

    const turnstileValid = await validateTurnstile(turnstileResponse, clientIP)
    
    if (!turnstileValid.success) {
        let errorMessage = `turnstile.unavailable`;

        if (turnstileValid["error-codes"]?.includes("invalid-input-response"))
        errorMessage = `turnstile.invalidResponse`

        if (turnstileValid["error-codes"]?.includes("timeout-or-duplicate"))
        errorMessage = `turnstile.keyUsedOrExpired`

        set.headers['content-type'] = 'text/html; charset=utf8'
        return eta.render(`${langName}/panel/stations/add`, { siteKey: process.env.TURNSTILE_SITE_KEY, lang, user, error: errorMessage })
    }

    let name = body?.name
    if (!name) name = "test"

    const description = body?.description

    Meteostanice.add(session.email, name, description)

    return redirect(`/${langName === "sk" ? `` : `${langName}/`}panel/stations`)
  })
  .get("/:station",  async ({ cookie, redirect, set, params: { station } }) => {
    const token = cookie.session.value
    const session = await Auth.getSession(token)

    if (!session) {
      return redirect(`/${langName === "sk" ? `` : `${langName}/`}auth?error=loginNeeded`)
    }

    const user = Auth.getUser(session.email)
    
    if (!station) {
        set.headers['content-type'] = 'text/html; charset=utf8'
        return eta.render(`${langName}/panel/stations/notFound`, { lang, user })
    }
    
    const meteostanica = Meteostanice.get(session.email, station)
    
    if (!meteostanica) {
      set.headers['content-type'] = 'text/html; charset=utf8'
      return eta.render(`${langName}/panel/stations/notFound`, { lang, user })
    }

    const data = Meteostanice.getData(meteostanica.id)

    set.headers['content-type'] = 'text/html; charset=utf8'
    return eta.render(`${langName}/panel/stations/station`, { user, meteostanica, data })
  })
  .get("/:station/edit",  async ({ cookie, redirect, set, params: { station } }) => {
    const token = cookie.session.value
    const session = await Auth.getSession(token)

    if (!session) {
      return redirect(`/${langName === "sk" ? `` : `${langName}/`}auth?error=loginNeeded`)
    }

    const user = Auth.getUser(session.email)
    
    if (!station) {
        set.headers['content-type'] = 'text/html; charset=utf8'
        return eta.render(`${langName}/panel/stations/notFound`, { lang, user })
    }
    
    const meteostanica = Meteostanice.get(session.email, station)
    
    if (!meteostanica) {
      set.headers['content-type'] = 'text/html; charset=utf8'
      return eta.render(`${langName}/panel/stations/notFound`, { lang, user })
    }

    set.headers['content-type'] = 'text/html; charset=utf8'
    return eta.render(`${langName}/panel/stations/edit`, { siteKey: process.env.TURNSTILE_SITE_KEY, user, meteostanica })
  })
  .post("/:station/edit", async ({ request, server, cookie, redirect, params: { station }, body, set }) => {
    const clientIP = request.headers.get('x-forwarded-for') ?? server.requestIP(request).address

    const token = cookie.session.value
    const session = await Auth.getSession(token)

    if (!session) {
      return redirect(`/${langName === "sk" ? `` : `${langName}/`}auth?error=loginNeeded`)
    }

    const user = Auth.getUser(session.email)

    if (!station) {
        set.headers['content-type'] = 'text/html; charset=utf8'
        return eta.render(`${langName}/panel/stations/notFound`, { lang, user })
    }
    
    const meteostanica = Meteostanice.get(session.email, station)
    
    if (!meteostanica) {
      set.headers['content-type'] = 'text/html; charset=utf8'
      return eta.render(`${langName}/panel/stations/notFound`, { lang, user })
    }

    const turnstileResponse = body?.["cf-turnstile-response"]
    
    if (!turnstileResponse) {
        set.headers['content-type'] = 'text/html; charset=utf8'
        return eta.render(`${langName}/panel/stations/edit`, { siteKey: process.env.TURNSTILE_SITE_KEY, lang, user, meteostanica, error: "turnstile.noToken" })
    }

    const turnstileValid = await validateTurnstile(turnstileResponse, clientIP)
    
    if (!turnstileValid.success) {
        let errorMessage = `turnstile.unavailable`;

        if (turnstileValid["error-codes"]?.includes("invalid-input-response"))
        errorMessage = `turnstile.invalidResponse`

        if (turnstileValid["error-codes"]?.includes("timeout-or-duplicate"))
        errorMessage = `turnstile.keyUsedOrExpired`

        set.headers['content-type'] = 'text/html; charset=utf8'
        return eta.render(`${langName}/panel/stations/edit`, { siteKey: process.env.TURNSTILE_SITE_KEY, lang, user, meteostanica, error: errorMessage })
    }

    const newName = body?.name

    if (!newName) {
      set.headers['content-type'] = 'text/html; charset=utf8'
      return eta.render(`${langName}/panel/stations/edit`, { siteKey: process.env.TURNSTILE_SITE_KEY, lang, user, meteostanica, error: "noName" })
    }

    const newOwnerEmail = body?.owner
    
    if (!normalizeEmail(newOwnerEmail)) {
      set.headers['content-type'] = 'text/html; charset=utf8'
      return eta.render(`${langName}/panel/stations/edit`, { siteKey: process.env.TURNSTILE_SITE_KEY, lang, user, meteostanica, error: "invalidOwner" })
    }

    const newOwner = Auth.getUser(newOwnerEmail)

    if (!newOwner) {
      set.headers['content-type'] = 'text/html; charset=utf8'
      return eta.render(`${langName}/panel/stations/edit`, { siteKey: process.env.TURNSTILE_SITE_KEY, lang, user, meteostanica, error: "ownerUserNotFound", errorDetails: { newOwnerEmail } })
    }

    const newDescription = body?.description

    Meteostanice.edit(meteostanica.id, newName, newDescription, newOwnerEmail)

    return redirect(`/${langName === "sk" ? `` : `${langName}/`}panel/stations/${meteostanica.id}`)
  })
  .get("/:station/resetWebsocketKey",  async ({ cookie, redirect, set, params: { station } }) => {
    const token = cookie.session.value
    const session = await Auth.getSession(token)

    if (!session) {
      return redirect(`/${langName === "sk" ? `` : `${langName}/`}auth?error=loginNeeded`)
    }

    const user = Auth.getUser(session.email)
    
    if (!station) {
        set.headers['content-type'] = 'text/html; charset=utf8'
        return eta.render(`${langName}/panel/stations/notFound`, { lang, user })
    }
    
    const meteostanica = Meteostanice.get(session.email, station)
    
    if (!meteostanica) {
      set.headers['content-type'] = 'text/html; charset=utf8'
      return eta.render(`${langName}/panel/stations/notFound`, { lang, user })
    }

    Meteostanice.resetWebsocketKey(meteostanica.id)

    return redirect(`/${langName === "sk" ? `` : `${langName}/`}panel/stations/${meteostanica.id}`)
  })
  .get("/:station/delete",  async ({ cookie, redirect, set, params: { station } }) => {
    const token = cookie.session.value
    const session = await Auth.getSession(token)

    if (!session) {
      return redirect(`/${langName === "sk" ? `` : `${langName}/`}auth?error=loginNeeded`)
    }

    const user = Auth.getUser(session.email)
    
    if (!station) {
        set.headers['content-type'] = 'text/html; charset=utf8'
        return eta.render(`${langName}/panel/stations/notFound`, { lang, user })
    }
    
    const meteostanica = Meteostanice.get(session.email, station)
    
    if (!meteostanica) {
      set.headers['content-type'] = 'text/html; charset=utf8'
      return eta.render(`${langName}/panel/stations/notFound`, { lang, user })
    }

    set.headers['content-type'] = 'text/html; charset=utf8'
    return eta.render(`${langName}/panel/stations/delete`, { user, meteostanica })
  })
  .get("/:station/deleteConfirm",  async ({ cookie, redirect, set, params: { station } }) => {
    const token = cookie.session.value
    const session = await Auth.getSession(token)

    if (!session) {
      return redirect(`/${langName === "sk" ? `` : `${langName}/`}auth?error=loginNeeded`)
    }

    const user = Auth.getUser(session.email)
    
    if (!station) {
        set.headers['content-type'] = 'text/html; charset=utf8'
        return eta.render(`${langName}/panel/stations/notFound`, { siteKey: process.env.TURNSTILE_SITE_KEY, lang, user })
    }
    
    const meteostanica = Meteostanice.get(session.email, station)
    
    if (!meteostanica) {
      set.headers['content-type'] = 'text/html; charset=utf8'
      return eta.render(`${langName}/panel/stations/notFound`, { siteKey: process.env.TURNSTILE_SITE_KEY, lang, user })
    }

    Meteostanice.delete(meteostanica.id)

    return redirect(`/${langName === "sk" ? `` : `${langName}/`}panel/stations`)
  })