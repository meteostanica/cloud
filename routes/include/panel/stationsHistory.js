import { Elysia } from 'elysia'

import { Eta } from "eta"
const eta = new Eta({ views: "./templates" })

import Auth from '../../../utils/auth';
import Meteostanice from '../../../utils/meteostanice'

export default (langName, lang) => new Elysia({ prefix: "/:station/history" })
  .get('/', async ({ cookie, redirect, set, params: { station } }) => {
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
    return eta.render(`${langName}/panel/stations/history/index`, { lang, meteostanica, user })
  })
  .get(`/:property`, async ({ cookie, redirect, set, params: { station, property }, query: { day, month, year } }) => {
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
    
    const dateMap = Meteostanice.getDateMap(station)
    
    const years = Object.keys(dateMap)
    const months = Object.keys(dateMap[years[years.length - 1]])
    const days = dateMap[years[years.length - 1]][months[months.length - 1]]

    const lastYear = years[years.length - 1]
    const lastMonth = months[months.length - 1]
    const lastDay = days[days.length - 1]

    const data = Meteostanice.getDataPropertyDaily(station, property, `${year ?? lastYear}-${month ?? lastMonth}-${day ?? lastDay}`)

    if (!data) {
        set.headers['content-type'] = 'text/html; charset=utf8'
        return eta.render(`${langName}/panel/stations/history/notFound`, { lang, user, property })
    }

    set.headers['content-type'] = 'text/html; charset=utf8'
    return eta.render(`${langName}/panel/stations/history/property`, { lang, user, dateMap: { years, months, days }, type: `daily`, property, meteostanica, data })
  })
 .get(`/:property/daily`, async ({ cookie, redirect, set, params: { station, property }, query: { day, month, year } }) => {
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
    
    const dateMap = Meteostanice.getDateMap(station)
    
    const years = Object.keys(dateMap)
    const months = Object.keys(dateMap[years[years.length - 1]])
    const days = dateMap[years[years.length - 1]][months[months.length - 1]]

    const lastYear = years[years.length - 1]
    const lastMonth = months[months.length - 1]
    const lastDay = days[days.length - 1]

    const data = Meteostanice.getDataPropertyDaily(station, property, `${year ?? lastYear}-${month ?? lastMonth}-${day ?? lastDay}`)

    if (!data) {
        set.headers['content-type'] = 'text/html; charset=utf8'
        return eta.render(`${langName}/panel/stations/history/notFound`, { lang, user, property })
    }

    set.headers['content-type'] = 'text/html; charset=utf8'
    return eta.render(`${langName}/panel/stations/history/property`, { lang, user, dateMap: { years, months, days }, type: `daily`, property, meteostanica, data })
  })
  .get(`/:property/monthly`, async ({ cookie, redirect, set, params: { station, property }, query: { month, year } }) => {
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
    
    const dateMap = Meteostanice.getDateMap(station)
    
    const years = Object.keys(dateMap)
    const months = Object.keys(dateMap[years[years.length - 1]])

    const lastYear = years[years.length - 1]
    const lastMonth = months[months.length - 1]

    const data = Meteostanice.getDataPropertyMonthly(station, property, `${year ?? lastYear}-${month ?? lastMonth}`)

    if (!data) {
        set.headers['content-type'] = 'text/html; charset=utf8'
        return eta.render(`${langName}/panel/stations/history/notFound`, { lang, user, property })
    }

    set.headers['content-type'] = 'text/html; charset=utf8'
    return eta.render(`${langName}/panel/stations/history/property`, { lang, user, dateMap: { years, months }, type: `monthly`, property, meteostanica, data })
  })
  .get(`/:property/yearly`, async ({ cookie, redirect, set, params: { station, property }, query: { month, year } }) => {
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
    
    const dateMap = Meteostanice.getDateMap(station)
    
    const years = Object.keys(dateMap)

    const lastYear = years[years.length - 1]

    const data = Meteostanice.getDataPropertyYearly(station, property, year ?? lastYear)

    if (!data) {
        set.headers['content-type'] = 'text/html; charset=utf8'
        return eta.render(`${langName}/panel/stations/history/notFound`, { lang, user, property })
    }

    set.headers['content-type'] = 'text/html; charset=utf8'
    return eta.render(`${langName}/panel/stations/history/property`, { lang, user, dateMap: { years }, type: `yearly`, property, meteostanica, data })
  })
  .get(`/:property/allTime`, async ({ cookie, redirect, set, params: { station, property }, query: { month, year } }) => {
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
    
    const dateMap = Meteostanice.getDateMap(station)

    const data = Meteostanice.getDataPropertyAllTime(station, property)

    if (!data) {
        set.headers['content-type'] = 'text/html; charset=utf8'
        return eta.render(`${langName}/panel/stations/history/notFound`, { lang, user, property })
    }

    set.headers['content-type'] = 'text/html; charset=utf8'
    return eta.render(`${langName}/panel/stations/history/property`, { lang, user, dateMap, type: `allTime`, property, meteostanica, data })
  })
//   .get(`/:property/allTime`, ({ params: { property }, set }) => {
//     const data = Meteostanica.getDataPropertyAllTime(property)
//     const dateMap = Meteostanica.getDateMap()

//     if (!data) {
//         set.headers['content-type'] = 'text/html; charset=utf8'
//         return eta.render(`${langName}/history/notFound`, { property })
//     }

//     set.headers['content-type'] = 'text/html; charset=utf8'
//     return eta.render(`${langName}/history/property`, { lang, dateMap, type: `allTime`, property, data })
//   })