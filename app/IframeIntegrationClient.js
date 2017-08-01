import iFrameResize from 'iframe-resizer/js/iframeResizer'
import isUndefined from 'lodash-es/isUndefined'
import includes from 'lodash-es/includes'
import endsWith from 'lodash-es/endsWith'
import isEmpty from 'lodash-es/isEmpty'

class IframeIntegrationClient {
  constructor (targetUrl, elementTagName) {
    this.targetUrl = targetUrl
    this.elementTagName = elementTagName
    this.clientName = 'iframe-resizer'
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

  generateRandomId () {
    return `${this.clientName}-${Math.random().toString(36).substr(2, 10)}`
  }

  render (options = {}, targetUrl, localElementTagName) {
    let ifrm, width, element
    let generatedId = this.generateRandomId()

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
          // finish event support here at some point
          //  let name = messageData.name
          //  let event = new CustomEvent(name, {bubbles: true, cancelable: true})
          //  document.dispatchEvent(event)
          //  // Create the event.
          //  let event = document.createEvent('Event');
          //
          //  // Define that the event name is 'build'.
          //  event.initEvent(name, true, true);
          //
          //  // Listen for the event.
          //  document.addEventListener('build', function (e) {
          //    // e.target matches elem
          //  }, false);
          //
          // target can be any Element or other EventTarget.
          //  elem.dispatchEvent(event);
          }
        }, `#${generatedId}`)
      }, 0)
    }
    // assign url & attributes
    ifrm.setAttribute('style', `width: ${width}; border: none`)
    ifrm.setAttribute('id', generatedId)
    ifrm.setAttribute('scrolling', 'no')
    ifrm.setAttribute('src', this.buildSourceUrl(targetUrl, options))

    return element.parentNode.replaceChild(ifrm, element)
  }
}

export default IframeIntegrationClient
