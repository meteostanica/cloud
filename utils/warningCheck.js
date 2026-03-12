import Meteostanice from "./meteostanice"

import { Eta } from "eta"
const eta = new Eta({ views: "./templates" })

export default async (langName, lang, station) => {
    const data = Meteostanice.getStationDataLast5Minutes(station.id)
    if (!data) return

    const thresholds = {
        indoorTemp: { low: 1800, high: 2800 },  // 18°C - 28°C
        indoorPressure: { low: 98000, high: 103000 }, // 980hPa - 1030hPa
        indoorHumidity: { low: 3000, high: 6000 },  // 30% - 60%
        outdoorTemp: { low: -1000, high: 3500 },  // -10°C - 35°C
        outdoorPressure: { low: 97000, high: 104000 }, // 970hPa - 1040hPa
        outdoorHumidity: { low: 2000, high: 9000 }   // 20% - 90%
    }

    for (const entries of data) {
        const detectedWarnings = []

        for (const [prop, limit] of Object.entries(thresholds)) {
            if (entries.every(entry => Number(entry[prop]) > limit.high)) {
                detectedWarnings.push(`high${prop.charAt(0).toUpperCase() + prop.slice(1)}`)
            }

            if (entries.every(entry => Number(entry[prop]) < limit.low)) {
                detectedWarnings.push(`low${prop.charAt(0).toUpperCase() + prop.slice(1)}`)
            }
        }
    }

    const currentWarnings = station?.warnings ?? [];

    const addedWarnings = [
        ...detectedWarnings.filter(w => !currentWarnings.includes(w))
    ];

    const removedWarnings = [
        ...currentWarnings.filter(w => !detectedWarnings.includes(w))
    ]

    const stationEmails = Meteostanice.getEmails(station.id)

    const emailLink = `${process.env.BASE_URL}/${langName === "sk" ? `` : `${langName}/`}panel/stations/${station.id}`

    if (addedWarnings.length) {
        for (const email of stationEmails) {
            await Meteostanice.sendWarnings(email, lang.emails.stations.addedWarnings.subject(), lang.emails.stations.addedWarnings.text({ stationName: station.name, warnings: addedWarnings, stationLink: emailLink }), eta.render(`${langName}/email/stations/addedWarnings`, { stationName: station.name, warnings: addedWarnings, stationLink: emailLink }))
        }
    }

    if (removedWarnings.length) {
        for (const email of stationEmails) {
            await Meteostanice.sendWarnings(email, lang.emails.stations.removedWarnings.subject(), lang.emails.stations.removedWarnings.text({ stationName: station.name, warnings: addedWarnings, stationLink: emailLink }), eta.render(`${langName}/email/stations/removedWarnings`, { stationName: station.name, warnings: addedWarnings, stationLink: emailLink }))
        }
    }

    Meteostanice.editWarnings(station.id, detectedWarnings)
}