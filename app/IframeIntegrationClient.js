/* global CustomEvent */
import iFrameResize from 'iframe-resizer/js/iframeResizer'
import isUndefined from 'lodash/fp/isUndefined'

class IframeIntegrationClient {
  constructor (elementTagName, targetUrl) {
    this.elementTagName = elementTagName
    this.targetUrl = targetUrl
  }

  encodeQueryData (data) {
    let ret = []
    for (let d in data) {
      ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]))
    }
    return ret.join('&')
  }

  render (options, elementTagName, targetUrl) {
    let ifrm, width, element

    if (isUndefined(elementTagName)) {
      element = document.getElementsByTagName(this.elementTagName)[0]
    } else {
      element = document.getElementsByTagName(elementTagName)[0]
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
    ifrm.setAttribute('scrolling', 'no')
    ifrm.setAttribute('style', 'width:' + width + ' border: none')
    ifrm.setAttribute('src', targetUrl + this.encodeQueryData(options))

    element.parentNode.replaceChild(ifrm, element)
  }
}

export default IframeIntegrationClient
