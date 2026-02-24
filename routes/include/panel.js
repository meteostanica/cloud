import { Elysia } from 'elysia'

import { Eta } from "eta"
const eta = new Eta({ views: "./templates" })

import Auth from '../../utils/auth';

export default (langName, lang) => new Elysia({ prefix: "/panel" })
  .get("/", async ({ cookie, redirect, set }) => {
    const token = cookie.session.value
    const session = await Auth.getSession(token)

    if (!session) {
      return redirect(`/${langName === "sk" ? `` : `${langName}/`}auth?error=${lang.auth.errors.loginNeeded}`)
    }

    const user = Auth.getUser(session.email)

    set.headers['content-type'] = 'text/html; charset=utf8'
    return eta.render(`${langName}/panel/index`, { user })
  })