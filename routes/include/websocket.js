import { Elysia } from 'elysia'
import Meteostanice from '../../utils/meteostanice'

export default new Elysia()
  .ws("/sendData/:key", {
    message({ send, data: { params: { key } } }, message) {
        if (message === "meow :3") {
            return send("meow :3")
        }

        message = Bun.JSON5.parse(message.toString())

        if (
            !message?.indoorTemp ||
            !message?.indoorPressure ||
            !message?.indoorHumidity ||
            !message?.indoorAltitude ||
            !message?.outdoorConnected ||
            !message?.outdoorTemp ||
            !message?.outdoorPressure ||
            !message?.outdoorHumidity ||
            !message?.outdoorAltitude
        ) {
            return send("missing required fields: indoorTemp, indoorPressure, indoorHumidity, indoorAltitude, outdoorConnected, outdoorTemp, outdoorPressure, outdoorHumidity, outdoorAltitude")
        }

        const meteostanica = Meteostanice.getWebsocket(key)

        if (!meteostanica) {
            return send("invalid station websocket key")
        }

        const {
            indoorTemp,
            indoorPressure,
            indoorHumidity,
            indoorAltitude,
            outdoorConnected,
            outdoorTemp,
            outdoorPressure,
            outdoorHumidity,
            outdoorAltitude
        } = message
        
        Meteostanice.postData(
            meteostanica.id,
            indoorTemp,
            indoorPressure,
            indoorHumidity,
            indoorAltitude,
            outdoorConnected,
            outdoorTemp,
            outdoorPressure,
            outdoorHumidity,
            outdoorAltitude
        )

        send(`posted data for ${meteostanica.name}`)
    }
  })