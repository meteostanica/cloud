import { Elysia } from 'elysia'
import Meteostanice from '../../utils/meteostanice'

export default (langName, lang) => new Elysia({ prefix: "/ws" })
  .ws("/sendData/:key", {
    open({ data: { params: { key } } }) {
        const meteostanica = Meteostanice.getWebsocket(key)

        if (!meteostanica) {
            return lang.websocket.errors.invalidKey({ key })
        }

        return lang.websocket.keepalive()
    },

    message({ data: { params: { key } } }, message) {
        const messageString = typeof message === 'string' ? message : new TextDecoder().decode(message);

        if (messageString === lang.websocket.keepalive()) {
            return lang.websocket.keepalive()
        }

        const meteostanica = Meteostanice.getWebsocket(key)

        if (!meteostanica) {
            return lang.websocket.errors.invalidKey({ key })
        }

        const data = JSON.parse(messageString)
        
        if (
            !data?.indoorTemp ||
            !data?.indoorPressure ||
            !data?.indoorHumidity ||
            !data?.indoorAltitude ||
            !data?.outdoorConnected ||
            !data?.outdoorTemp ||
            !data?.outdoorPressure ||
            !data?.outdoorHumidity ||
            !data?.outdoorAltitude
        ) {
            return lang.websocket.errors.missingFields()
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

        return lang.websocket.dataSaved({ meteostanica })
    }
  })