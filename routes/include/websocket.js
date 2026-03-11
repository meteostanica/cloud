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

        const {
            indoorTemp,
            indoorPressure,
            indoorHumidity,
            indoorAltitude,
            outdoorConnected,
            outdoorTemp,
            outdoorPressure,
            outdoorHumidity,
            outdoorAltitude,
            timestamp
        } = message

        if (
            !indoorTemp?.length ||
            !indoorPressure?.length ||
            !indoorHumidity?.length ||
            !indoorAltitude?.length ||
            !outdoorConnected?.toString()?.length ||
            !outdoorTemp?.length ||
            !outdoorPressure?.length ||
            !outdoorHumidity?.length ||
            !outdoorAltitude?.length
        ) {
            return lang.websocket.errors.missingFields()
        }
        
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
            outdoorAltitude,
            timestamp
        )

        return lang.websocket.dataSaved({ meteostanica })
    }
  })