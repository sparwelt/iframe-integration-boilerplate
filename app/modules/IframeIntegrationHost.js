/* global window, URLSearchParams */
import assign from 'lodash-es/assign'
import isObject from 'lodash-es/isObject'
import eventEmitter from './eventEmitter'
import 'url-search-params-polyfill'
import 'iframe-resizer/js/iframeResizer.contentWindow'

@eventEmitter
class IframeIntegrationHost {
  constructor (settings = {}) {
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

  getParameters () {
    return new URLSearchParams(window.location.search)
  }
}

export default IframeIntegrationHost
