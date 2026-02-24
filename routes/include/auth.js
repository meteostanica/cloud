import { Elysia } from 'elysia'

import { Eta } from "eta"
const eta = new Eta({ views: "./templates" })

import ratelimits from '../../utils/ratelimits'
import normalizeEmail from '../../utils/normalizeEmail';
import Auth from '../../utils/auth';
import validateTurnstile from '../../utils/validateTurnstile';
import getFormatBasedOnCount from '../../utils/getFormatBasedOnCount';
import formatTimeToString from '../../utils/formatTimeToString';

export default (langName, lang) => new Elysia({ prefix: "/auth" })
  .get("/", async ({ cookie, redirect, query, set }) => {
    const token = cookie.session.value
    const session = await Auth.getSession(token)

    if (session) {
      return redirect(`/${langName === "sk" ? `` : `${langName}/`}panel`)
    }

    const error = query?.error

    set.headers['content-type'] = 'text/html; charset=utf8'
    return eta.render(`${langName}/auth/index`, { siteKey: process.env.TURNSTILE_SITE_KEY, lang, error })
  })
  .post("/", async ({ request, server, body, redirect }) => {
    const clientIP = request.headers.get('x-forwarded-for') ?? server.requestIP(request).address

    const email = body?.email
    if (!normalizeEmail(email)) return redirect(`/${langName === "sk" ? `` : `${langName}/`}auth?error=invalidEmail`)

    const hourlyEmailRatelimit = ratelimits("authEmailHourly", email, process.env.AUTH_EMAIL_HOURLY_RATELIMIT, 3600)
    if (hourlyEmailRatelimit.status) return Response.redirect(`/${langName === "sk" ? `` : `${langName}/`}auth?error=ratelimits.email`)

    const hourlyIPRatelimit = ratelimits("authIPHourly", clientIP, process.env.AUTH_IP_HOURLY_RATELIMIT, 3600)
    if (hourlyIPRatelimit.status) return Response.redirect(`/${langName === "sk" ? `` : `${langName}/`}auth?error=ratelimits.ip`)

    const dailyIPRatelimit = ratelimits("authIPDaily", clientIP, process.env.AUTH_IP_DAILY_RATELIMIT, 86400)
    if (dailyIPRatelimit.status) return Response.redirect(`/${langName === "sk" ? `` : `${langName}/`}auth?error=ratelimits.ip`)

    const turnstileResponse = body?.["cf-turnstile-response"]
    // const turnstileResponse = "1x00000000000000000000AA"
    if (!turnstileResponse) return redirect(`/${langName === "sk" ? `` : `${langName}/`}auth?error=turnstile.noToken`)

    const turnstileValid = await validateTurnstile(turnstileResponse, clientIP)

    if (!turnstileValid.success) {
      let errorMessage = `turnstile.unavailable`;

      if (turnstileValid["error-codes"]?.includes("invalid-input-response"))
        errorMessage = `turnstile.invalidResponse`

      if (turnstileValid["error-codes"]?.includes("timeout-or-duplicate"))
        errorMessage = `turnstile.keyUsedOrExpired`

      return redirect(`/${langName === "sk" ? `` : `${langName}/`}auth?error=${errorMessage}`)
    }

    const verification = Auth.addVerification(email)

    const emailLink = `https://meteostanica.com/${langName === "sk" ? `` : `${langName}/`}auth/verify?token=${verification.token}&code=${verification.code}`

    await Auth.sendVerification(email, lang.emails.auth.subject, lang.emails.auth.text(verification.code, emailLink), eta.render(`${langName}/email/auth`, { code: verification.code, link: emailLink }))

    return redirect(`/${langName === "sk" ? `` : `${langName}/`}auth/verify?token=${verification.token}`)
  })
  .get("/verify", async ({ query, redirect, set, cookie }) => {
    const token = query?.token
    const code = Number.parseInt(query?.code)

    if (!token) {
      return redirect(`/${langName === "sk" ? `` : `${langName}/`}auth?error=noVerificationToken`)
    }

    const verification = Auth.getVerification(token)

    if (!verification?.valid) {
      return redirect(`/${langName === "sk" ? `` : `${langName}/`}auth?error=verificationTokenUsedOrExpired`)
    }

    if (!code) {
      set.headers['content-type'] = 'text/html; charset=utf8'
      return eta.render(`${langName}/auth/verify`, { token })
    }

    if (code !== verification.code) {
      const codeRatelimit = ratelimits("authCodeHourly", token, process.env.AUTH_CODE_HOURLY_RATELIMIT, 3600)
      if (codeRatelimit.status) return eta.render(`${langName}/auth/verify`, { token, lang, error: `ratelimits.code` })

      set.headers['content-type'] = 'text/html; charset=utf8'
      return eta.render(`${langName}/auth/verify`, { token, lang, error: `invalidVerificationCode` })
    }

    Auth.removeVerification(token)

    let user = Auth.getUser(verification.email)

    if (!user) {
      user = Auth.addUser(verification.email)
    }

    const session = await Auth.createSession(verification.email)

    cookie.session.value = session.token

    return redirect(`/${langName === "sk" ? `` : `${langName}/`}panel`)
  })
  .get("/logout", async ({ cookie, redirect }) => {
    const token = cookie.session.value
    const session = await Auth.getSession(token)

    if (session) {
      Auth.removeSession(session.id)
      delete cookie.session
    }

    return redirect(`/${langName === "sk" ? `` : langName}`)
  })