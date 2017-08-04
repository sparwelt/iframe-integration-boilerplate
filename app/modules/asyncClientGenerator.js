import isFunction from 'lodash-es/isFunction'
import isUndefined from 'lodash-es/isUndefined'

let asyncClient = function (win, Client, iframeClientName, asyncIframeClientName, asyncCallbackName, settingsOrTargetUrl, targetElementName) {
  win[iframeClientName] = new Client(
    settingsOrTargetUrl,
    targetElementName,
    iframeClientName
  )

  // old school type of async usage
  if (typeof win[asyncCallbackName] !== 'undefined') {
    win[asyncCallbackName](win[iframeClientName])
  }

  let applyCall = (method, args) => {
    if (isFunction(method)) {
      method(win[iframeClientName])
    } else {
      if (isFunction(win[iframeClientName][method])) {
        return win[iframeClientName][method].apply(win[iframeClientName], args)
      } else {
        console.debug(`tried to call unknown function "${method}" on iframe client "${iframeClientName}"`)
      }
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
}

export default asyncClient
