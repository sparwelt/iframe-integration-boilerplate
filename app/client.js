/* global window */
import IframeIntegrationClient from './IframeIntegrationClient.js'
import isFunction from '../node_modules/lodash-es/isFunction'
import isUndefined from '../node_modules/lodash-es/isUndefined'

(function (win, Client, iframeClientName, asyncIframeClientName, asyncCallbackName, targetUrl, targetElementName) {
  win[iframeClientName] = new Client(
    targetUrl,
    targetElementName
  )

  // old school type of async usage
  if (typeof win[asyncCallbackName] !== 'undefined') {
    win[asyncCallbackName](win[iframeClientName])
  }

  let applyCall = (method, args) => {
    if (isFunction(method)) {
      method(win[iframeClientName])
    } else {
      return win[iframeClientName][method].apply(win[iframeClientName], args)
    }
  }
  // modern implementation of async client - you can change the name from iic to something else here
  // also change it on the implementation side
  if (!isUndefined(win[asyncIframeClientName]) && !isUndefined(win[asyncIframeClientName].q)) {
    win[asyncIframeClientName].q.forEach((call) => {
      applyCall(call[0], call[1])
    })
  }
  win[asyncIframeClientName] = (method, args) => {
    return applyCall(method, args)
  }
})(
  window,
  IframeIntegrationClient,
  'iframeIntegrationClient',
  'iic',
  'iframeIntegrationAsyncInit',
  'http://davidjbradshaw.com/iframe-resizer/example/frame.content.html',
  'iframe-integration-placement'
)
