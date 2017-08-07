import 'element-dataset/lib/browser/index.es'
import iFrameResize from 'iframe-resizer/js/iframeResizer'
import isUndefined from 'lodash-es/isUndefined'
import includes from 'lodash-es/includes'
import endsWith from 'lodash-es/endsWith'
import isEmpty from 'lodash-es/isEmpty'
import isString from 'lodash-es/isString'
import assign from 'lodash-es/assign'
import omit from 'lodash-es/omit'
import filter from 'lodash-es/filter'
import forEach from 'lodash-es/forEach'

/**
 * @TODO merge elementTageName usage with settings
 */
class IframeIntegrationClient {
  /**
   * constructor
   *
   * @param settings
   * @param clientName
   */
  constructor (settings, clientName = 'iframe-resizer') {
    this.eventHandlers = []
    this.clientName = clientName
    this.iFrameResize = iFrameResize
    this.defaultSettings = {
      log: false,
      autoResize: true,
      scrolling: false,
      width: '100%',
      cssSelector: 'iframe-integration-placement'
    }

    this.defaultSettings = assign({}, this.defaultSettings, settings)
  }

  /**
   * creates query from dataset
   *
   * @param data
   * @returns {string}
   */
  encodeQueryData (data) {
    let ret = []
    for (let d in data) {
      ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]))
    }
    return ret.join('&')
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
   * returns settings object based on default and local settings
   *
   * @param settings
   * @returns {*}
   */
  getFullSettings (settings) {
    return assign({}, this.defaultSettings, settings)
  }

  /**
   * gets the element to replace with an iframe
   *
   * @param localElementTagName
   * @returns {*}
   */
  getElement (cssSelector) {
    let element = document.getElementsByTagName(cssSelector)[0]

    if (isUndefined(element)) {
      throw new Error(`no matching element for listing was found or provided, place an ${cssSelector} on the page before executing the render method or pass an element along as the third parameter`)
    } else {
      return element
    }
  }

  /**
   * registers an event handler
   *
   * @param eventName
   * @param eventCallback
   */
  on (eventName, eventCallback) {
    this.eventHandlers.push({
      name: eventName,
      callback: eventCallback
    })
  }

  /**
   * renders the iframe into the page and handles all related logic
   *
   * @param parameters
   * @param settingsOrTargetUrl
   * @param localElementTagName
   * @returns {Node}
   */
  render (parameters = {}, settingsOrTargetUrl = {}, localElementTagName = null) {
    let iframe = document.createElement('iframe')
    let generatedId = this.generateRandomId()
    let settings = this.getFullSettings(settingsOrTargetUrl)
    let element = this.getElement(settings.cssSelector)

    // assign url & attributes
    iframe.setAttribute('style', `width: ${settings.width}; border: none`)
    iframe.setAttribute('id', generatedId)
    iframe.setAttribute('scrolling', settings.scrolling ? 'yes' : 'no')

    /**
     * on load we will start the asynchronous initialization of the iframe resizer
     * plugin, we also remove internal parameters from the settings array and
     * just hand it over
     */
    iframe.onload = () => {
      setTimeout(() => {
        iFrameResize(assign({}, omit(settings, ['width', 'targetUrl', 'scrolling', 'localElementTagName']), {
          messageCallback: (data) => {
            forEach(filter(this.eventHandlers, {name: data.message.name}), (handler) => {
              handler.callback(data.message.data, data.message.name, data.iframe)
            })
          }
        }), `#${generatedId}`)
      }, 0)
    }

    iframe.setAttribute('src', this.buildSourceUrl(
      settings.targetUrl,
      this.getFullParameters(parameters, element),
      element
    ))

    return element.parentNode.replaceChild(iframe, element)
  }
}

export default IframeIntegrationClient
