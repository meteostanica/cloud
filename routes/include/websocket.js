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
        if (message === lang.websocket.keepalive()) {
            return lang.websocket.keepalive()
        }

        const meteostanica = Meteostanice.getWebsocket(key)

        if (!meteostanica) {
            return lang.websocket.errors.invalidKey({ key })
        }

        if (
            !message?.indoorTemp?.length ||
            !message?.indoorPressure?.length ||
            !message?.indoorHumidity?.length ||
            !message?.indoorAltitude?.length ||
            !message?.outdoorConnected?.length ||
            !message?.outdoorTemp?.length ||
            !message?.outdoorPressure?.length ||
            !message?.outdoorHumidity?.length ||
            !message?.outdoorAltitude?.length
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