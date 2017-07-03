/* global CustomEvent */
import iFrameResize from 'iframe-resizer/js/iframeResizer'
import isUndefined from 'lodash-es/isUndefined'
import includes from 'lodash-es/includes'
import endsWith from 'lodash-es/endsWith'
import isEmpty from 'lodash-es/isEmpty'

class IframeIntegrationClient {
  constructor (targetUrl, elementTagName) {
    this.targetUrl = targetUrl
    this.elementTagName = elementTagName
  }

  encodeQueryData (data) {
    let ret = []
    for (let d in data) {
      ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]))
    }
    return ret.join('&')
  }

  buildSourceUrl (targetUrl, options) {
    if (isEmpty(options)) {
      return targetUrl
    }
    if (endsWith(targetUrl, '?')) {
      return `${targetUrl}${this.encodeQueryData(options)}`
    } else if (includes(targetUrl, '?')) {
      return `${targetUrl}&${this.encodeQueryData(options)}`
    } else {
      return `${targetUrl}?${this.encodeQueryData(options)}`
    }
  }

  render (options = {}, targetUrl, localElementTagName) {
    let ifrm, width, element

    if (isUndefined(localElementTagName)) {
      element = document.getElementsByTagName(this.elementTagName)[0]
    } else {
      element = document.getElementsByTagName(localElementTagName)[0]
    }
    if (isUndefined(element)) {
      console.error(`no matching element for listing was found or provided, place an ${this.elementTagName} on the page before executing the render method or pass an element along as the third parameter`)
      return false
    }
    if (isUndefined(targetUrl)) {
      targetUrl = this.targetUrl
    }
    if (isUndefined(options.width)) {
      width = '100%'
    } else {
      width = options.width
      delete options.width
    }

    ifrm = document.createElement('iframe')
    // on load we will asyncrounously initiliaze the iframe resizer plugin
    ifrm.onload = () => {
      setTimeout(() => {
        iFrameResize({
          messageCallback: function (messageData) {
            let name = messageData.name
            let event = new CustomEvent(name, {bubbles: true, cancelable: true})
            document.dispatchEvent(event)
          }
        })
      }, 0)
    }
    // assign url & attributes
    ifrm.setAttribute('style', `width: ${width}; border: none`)
    ifrm.setAttribute('scrolling', 'no')
    ifrm.setAttribute('src', this.buildSourceUrl(targetUrl, options))

    return element.parentNode.replaceChild(ifrm, element)
  }
}

export default IframeIntegrationClient
