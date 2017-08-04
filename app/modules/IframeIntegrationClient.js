import 'element-dataset/lib/browser/index.es'
import iFrameResize from 'iframe-resizer/js/iframeResizer'
import isUndefined from 'lodash-es/isUndefined'
import includes from 'lodash-es/includes'
import endsWith from 'lodash-es/endsWith'
import isEmpty from 'lodash-es/isEmpty'
import isString from 'lodash-es/isString'
import assign from 'lodash-es/assign'
import omit from 'lodash-es/omit'

/**
 * @TODO merge elementTageName usage with settings
 */
class IframeIntegrationClient {
  constructor (settingsOrTargetUrl, elementTagName, clientName = 'iframe-resizer') {
    this.elementTagName = elementTagName
    this.clientName = clientName
    this.iFrameResize = iFrameResize
    this.defaultSettings = {
      log: false,
      autoResize: true,
      scrolling: false,
      width: '100%'
    }

    /**
     * backwards compatibility
     * @deprecated 2.0
     */
    if (isString(settingsOrTargetUrl)) {
      this.defaultSettings = assign({}, this.defaultSettings, {
        targetUrl: settingsOrTargetUrl
      })
    } else {
      this.defaultSettings = assign({}, this.defaultSettings, settingsOrTargetUrl)
    }
  }

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

  generateRandomId () {
    return `${this.clientName}-${Math.random().toString(36).substr(2, 10)}`
  }

  getFullParameters (parameters, element) {
    assign(parameters, element.dataset)

    return parameters
  }

  getFullSettings (settingsOrTargetUrl, localElementTagName = null) {
    let settings

    /**
     * backwards compatibility
     * @deprecated 2.0
     */
    if (isString(settingsOrTargetUrl)) {
      settings = {
        targetUrl: settingsOrTargetUrl,
        localElementTagName: localElementTagName
      }
    } else {
      settings = settingsOrTargetUrl
      if (isUndefined(settings.localElementTagName)) {
        settings.localElementTagName = localElementTagName
      }
    }

    settings = assign({}, this.defaultSettings, settings)

    return settings
  }

  getElement (localElementTagName) {
    let element
    let usableElementTagName = (!isUndefined(localElementTagName) ? localElementTagName : this.elementTagName)

    element = document.getElementsByTagName(usableElementTagName)[0]

    if (isUndefined(element)) {
      throw new Error(`no matching element for listing was found or provided, place an ${usableElementTagName} on the page before executing the render method or pass an element along as the third parameter`)
    } else {
      return element
    }
  }

  render (parameters = {}, settingsOrTargetUrl = {}, localElementTagName = null) {
    let ifrm
    let generatedId = this.generateRandomId()
    let settings = this.getFullSettings(settingsOrTargetUrl, localElementTagName)
    let element = this.getElement(settings.localElementTagName)

    ifrm = document.createElement('iframe')

    // assign url & attributes
    ifrm.setAttribute('style', `width: ${settings.width}; border: none`)
    ifrm.setAttribute('id', generatedId)
    ifrm.setAttribute('scrolling', settings.scrolling ? 'yes' : 'no')

    /**
     * on load we will start the asynchronous initialization of the iframe resizer
     * plugin, we also remove internal parameters from the settings array and
     * just hand it over
     */
    ifrm.onload = () => {
      setTimeout(() => {
        iFrameResize(omit(settings, ['width', 'targetUrl', 'scrolling', 'localElementTagName']), `#${generatedId}`)
      }, 0)
    }

    ifrm.setAttribute('src', this.buildSourceUrl(
      settings.targetUrl,
      this.getFullParameters(parameters, element),
      element
    ))

    return element.parentNode.replaceChild(ifrm, element)
  }
}

export default IframeIntegrationClient
