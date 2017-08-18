import isFunction from 'lodash-es/isFunction'
import isUndefined from 'lodash-es/isUndefined'

let asyncClient = function (win, Client, serviceName, asyncServiceName, settings) {
  win[serviceName] = new Client(
    settings,
    serviceName
  )

  let applyCall = (method, args) => {
    if (isFunction(method)) {
      method(win[serviceName])
    } else {
      if ('on' === method) {
        return win[serviceName].on(args[0], args[1])
      } else if (isFunction(win[serviceName][method])) {
        return win[serviceName][method].apply(win[serviceName], args)
      } else {
        console.debug(`tried to call unknown function "${method}" on client "${serviceName}"`)
      }
    }
  }

  // modern implementation of async client - you can change the name from iic to something else here
  // also change it on the implementation side
  if (!isUndefined(win[asyncServiceName]) && !isUndefined(win[asyncServiceName].q)) {
    win[asyncServiceName].q.forEach((call) => {
      applyCall(call[0], call[1])
    })
  }
  win[asyncServiceName] = (method, args) => {
    return applyCall(method, args)
  }
}

export default asyncClient
