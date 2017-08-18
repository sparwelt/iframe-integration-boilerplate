import iFrameResize from 'iframe-resizer/js/iframeResizer'
import isUndefined from 'lodash-es/isUndefined'
import includes from 'lodash-es/includes'
import endsWith from 'lodash-es/endsWith'
import isEmpty from 'lodash-es/isEmpty'
import assign from 'lodash-es/assign'
import omit from 'lodash-es/omit'
import isObject from 'lodash-es/isObject'
import eventEmitter from './eventEmitter'
import forEach from 'lodash-es/forEach'
import 'element-dataset/lib/browser/index.es'

@eventEmitter
class IframeIntegrationClient {

  /**
   * constructor
   *
   * @param configuredSettings
   * @param clientName
   */
  constructor (configuredSettings, clientName = 'iframe-resizer') {
    this.clientName = clientName
    this.iFrameResize = iFrameResize
    this.active = false
    this.defaultSettings = {
      log: false,
      autoResize: true,
      scrolling: false,
      width: '100%',
      cssSelector: 'iframe-integration-placement'
    }
    this.settings = assign({}, this.defaultSettings, configuredSettings)

    this.eventEmitSendCallback = (payload) => {
      // we kinda need the iframe selector here @todo optimize the selector logic here
      forEach(document.querySelectorAll('[data-iic-active]'), (element) => {
        if (!isUndefined(element.iFrameResizer)) {
          element.iFrameResizer.sendMessage(payload)
        }
      })
    }
    this.eventEmitReadyCallback = () => {
      return this.active
    }
  }

  /**
   * creates query from dataset
   *
   * @param data
   * @returns {string}
   */
  encodeQueryData (data) {
    return Object.keys(data).map((k) => {
        // we have an object, we gonna json-stringifiy it
        if (isObject(data[k])) {
            data[k] = JSON.stringify(data[k])
        }
        return `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`
    }).join('&');
  }

  /**
   * generates the url to be loaded inside the iframe, overload this method to call
   * certain endpoints depending on an option or the element
   *
   * @param targetUrl
   * @param parameters
   * @param element
   * @returns {*}
   */
  buildSourceUrl (targetUrl, parameters, element) {
    if (isEmpty(parameters)) {
      return targetUrl
    }
    if (endsWith(targetUrl, '?')) {
      return `${targetUrl}${this.encodeQueryData(parameters)}`
    } else if (includes(targetUrl, '?')) {
      return `${targetUrl}&${this.encodeQueryData(parameters)}`
    } else {
      return `${targetUrl}?${this.encodeQueryData(parameters)}`
    }
  }

  /**
   * returns a random id to be used for the iframe
   *
   * @returns {string}
   */
  generateRandomId () {
    return `${this.clientName}-${Math.random().toString(36).substr(2, 10)}`
  }

  /**
   * generates a full set of parameters by what was passed on the call and whats
   * present on the element itself as data-* attributes
   *
   * @param parameters
   * @param element
   * @returns {*}
   */
  getFullParameters (parameters, element) {
    return assign(parameters, element.dataset)
  }

  /**
   * returns settings object based on settings and element settings
   *
   * @param localSettings
   * @returns {*}
   */
  getFullSettings (localSettings) {
    return assign({}, this.settings, localSettings)
  }

  /**
   * gets the element to replace with an iframe
   *
   * @param cssSelector
   * @returns {*}
   */
  getElements (cssSelector) {
    let elements = document.querySelectorAll(cssSelector)

    if (isUndefined(elements)) {
      throw new Error(`no matching element for listing was found or provided, place an ${cssSelector} on the page before executing the render method or pass an element along as the third parameter`)
    } else {
      return elements
    }
  }

  /**
   * renders the iframe into the page and handles all related logic
   *
   * @param parameters
   * @param settings
   * @returns {Node}
   */
  render (parameters = {}, settings = {}) {
    settings = this.getFullSettings(settings)

    forEach(this.getElements(settings.cssSelector), (element) => {
      let generatedId = this.generateRandomId()
      let iframe = document.createElement('iframe')

      // assign url & attributes
      iframe.setAttribute('style', `width: ${settings.width}; border: none`)
      iframe.setAttribute('id', generatedId)
      iframe.setAttribute('data-iic-active', true)
      iframe.setAttribute('scrolling', settings.scrolling ? 'yes' : 'no')

      /**
       * on load we will start the asynchronous initialization of the iframe resizer
       * plugin, we also remove internal parameters from the settings array and
       * just hand it over
       */
      iframe.onload = () => {
        setTimeout(() => {
          iFrameResize(assign({}, omit(settings, ['width', 'targetUrl', 'scrolling', 'cssSelector']), {
            messageCallback: (data) => {
              this.receive(data.message.name, [data.message.data, data.message.name, data.iframe])
            },
            initCallback: () => {
              this.active = true
            }
          }), `#${generatedId}`)
        }, 0)
      }

      iframe.setAttribute('src', this.buildSourceUrl(
        settings.targetUrl,
        this.getFullParameters(parameters, element),
        element
      ))

      element.parentNode.replaceChild(iframe, element)
    })
  }
}

export default IframeIntegrationClient
