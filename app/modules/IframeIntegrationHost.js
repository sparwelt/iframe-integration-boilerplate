/* global window, URLSearchParams */
import assign from 'lodash-es/assign'
import isObject from 'lodash-es/isObject'
import forEach from 'lodash-es/forEach'
import 'url-search-params-polyfill'
import 'iframe-resizer/js/iframeResizer.contentWindow'

class IframeIntegrationHost {
  constructor (settings = {}) {
    this.eventQueue = []
    this.defaultSettings = {
      readyCallback: () => {
        this.activate()
      }
    }

    this.setUp(settings)
  }

  activate () {
    forEach(this.eventQueue, (event) => {
      this.trigger(event.name, event.data)
    })
  }

  setUp (settings) {
    window.iFrameResizer = assign({}, this.defaultSettings, settings)
  }

  getParameters () {
    return new URLSearchParams(window.location.search)
  }

  trigger (name, data) {
    if (isObject(window.parentIFrame)) {
      window.parentIFrame.sendMessage({'name': name, 'data': data})
    } else {
      this.eventQueue.push({'name': name, 'data': data})
    }
  }
}

export default IframeIntegrationHost
