import { Elysia } from 'elysia'
import Meteostanice from '../../utils/meteostanice'

export default (langName, lang) => new Elysia({ prefix: "/ws" })
  .ws("/sendData/:key", {
    open({ send, data: { params: { key } } }) {
        const meteostanica = Meteostanice.getWebsocket(key)

        if (!meteostanica) {
            return send(lang.websocket.errors.invalidKey({ key }))
        }

        return send(lang.websocket.keepalive())
    },

    message({ send, data: { params: { key } } }, message) {
        if (message === lang.websocket.keepalive()) {
            return send(lang.websocket.keepalive())
        }

        const meteostanica = Meteostanice.getWebsocket(key)

        if (!meteostanica) {
            return send(lang.websocket.errors.invalidKey({ key }))
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
            return send(lang.websocket.errors.missingFields())
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

        return send(lang.websocket.dataSaved({ meteostanica }))
    }
  })