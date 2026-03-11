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

    let years, months, days, selectedYear, selectedMonth, selectedDay
    
    if (Object.keys(dateMap).length) {
        years = Object.keys(dateMap)
        selectedYear = years.find(i => i === year) ?? years[years.length - 1]

        months = Object.keys(dateMap?.[selectedYear])
        selectedMonth = months.find(i => i === month) ?? months[months.length - 1]

        days = dateMap?.[selectedYear]?.[selectedMonth]
        selectedDay = days.find(i => i === day) ?? days[days.length - 1]

        const data = Meteostanice.getDataPropertyDaily(station, property, `${selectedYear}-${selectedMonth}-${selectedDay}`)

        if (!data) {
            set.headers['content-type'] = 'text/html; charset=utf8'
            return eta.render(`${langName}/panel/stations/history/notFound`, { lang, user, property })
        }
    }

    set.headers['content-type'] = 'text/html; charset=utf8'
    return eta.render(`${langName}/panel/stations/history/property`, { lang, user, selected: { day: selectedDay, month: selectedMonth, year: selectedYear }, dateMap: { years, months, days, raw: dateMap }, type: `daily`, property, meteostanica, data })
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
    
    let years, months, days, selectedYear, selectedMonth, selectedDay

    if (Object.keys(dateMap).length) {
        years = Object.keys(dateMap)
        selectedYear = years.find(i => i === year) ?? years[years.length - 1]

        months = Object.keys(dateMap?.[selectedYear])
        selectedMonth = months.find(i => i === month) ?? months[months.length - 1]

        days = dateMap?.[selectedYear]?.[selectedMonth]
        selectedDay = days.find(i => i === day) ?? days[days.length - 1]

        const data = Meteostanice.getDataPropertyDaily(station, property, `${selectedYear}-${selectedMonth}-${selectedDay}`)

        if (!data) {
            set.headers['content-type'] = 'text/html; charset=utf8'
            return eta.render(`${langName}/panel/stations/history/notFound`, { lang, user, property })
        }
    }

    set.headers['content-type'] = 'text/html; charset=utf8'
    return eta.render(`${langName}/panel/stations/history/property`, { lang, user, selected: { day: selectedDay, month: selectedMonth, year: selectedYear }, dateMap: { years, months, days, raw: dateMap }, type: `daily`, property, meteostanica, data })
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
    
    let years, months, selectedYear, selectedMonth

    if (Object.keys(dateMap).length) {
        years = Object.keys(dateMap)
        selectedYear = years.find(i => i === year) ?? years[years.length - 1]

        months = Object.keys(dateMap?.[selectedYear])
        selectedMonth = months.find(i => i === month) ?? months[months.length - 1]

        const data = Meteostanice.getDataPropertyMonthly(station, property, `${selectedYear}-${selectedMonth}`)

        if (!data) {
            set.headers['content-type'] = 'text/html; charset=utf8'
            return eta.render(`${langName}/panel/stations/history/notFound`, { lang, user, property })
        }
    }

    set.headers['content-type'] = 'text/html; charset=utf8'
    return eta.render(`${langName}/panel/stations/history/property`, { lang, user, selected: { month: selectedMonth, year: selectedYear }, dateMap: { years, months, raw: dateMap }, type: `monthly`, property, meteostanica, data })
  })
  .get(`/:property/yearly`, async ({ cookie, redirect, set, params: { station, property }, query: { year } }) => {
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

    let years, selectedYear
    
    if (Object.keys(dateMap).length) {
        years = Object.keys(dateMap)
        selectedYear = years.find(i => i === year) ?? years[years.length - 1]

        const data = Meteostanice.getDataPropertyYearly(station, property, selectedYear)

        if (!data) {
            set.headers['content-type'] = 'text/html; charset=utf8'
            return eta.render(`${langName}/panel/stations/history/notFound`, { lang, user, property })
        }
    }

    set.headers['content-type'] = 'text/html; charset=utf8'
    return eta.render(`${langName}/panel/stations/history/property`, { lang, user, selected: { year: selectedYear }, dateMap: { years, raw: dateMap }, type: `yearly`, property, meteostanica, data })
  })
  .get(`/:property/allTime`, async ({ cookie, redirect, set, params: { station, property } }) => {
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
    return eta.render(`${langName}/panel/stations/history/property`, { lang, user, dateMap: { raw: dateMap }, type: `allTime`, property, meteostanica, data })
  })