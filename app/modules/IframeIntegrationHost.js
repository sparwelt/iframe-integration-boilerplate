/* global window, URLSearchParams */
import assign from 'lodash-es/assign'
import isObject from 'lodash-es/isObject'
import eventEmitter from './eventEmitter'
import 'url-search-params-polyfill'
import 'iframe-resizer/js/iframeResizer.contentWindow'

@eventEmitter
class IframeIntegrationHost {
  constructor (settings = {}) {
    this.urlParams = new URLSearchParams(window.location.search)
    this.eventQueue = []
    this.defaultSettings = {
      readyCallback: () => {
        this.emitStoredEvents()
      },
      messageCallback: (data) => {
        this.receive(data.name, [data.data, data.name])
      }
    }
    this.eventEmitSendCallback = (payload) => {
      window.parentIFrame.sendMessage(payload)
    }
    this.eventEmitReadyCallback = () => {
      return isObject(window.parentIFrame)
    }
    this.setUp(settings)
  }

  setUp (settings) {
    window.iFrameResizer = assign({}, this.defaultSettings, settings)
  }

  /**
   * returns the value of a parameter passed, if no value is found fallback will be returned
   *
   * @param parameterName
   * @param fallback
   * @returns {*}
   */
  get (parameterName, fallback = null) {
    let parameterValue = fallback
    if (this.getParameters().has(parameterName)) {
      if (1 === this.getParameters().getAll(parameterName).length) {
        parameterValue = this.getParameters().getAll(parameterName)[0]
      } else {
        parameterValue = this.getParameters().getAll(parameterName)
      }
    }

    try {
      return JSON.parse(parameterValue)
    } catch (e) {
      return parameterValue
    }
  }

  getParameters () {
    return this.urlParams
  }
}

export default IframeIntegrationHost
