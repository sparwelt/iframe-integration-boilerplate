/* global CustomEvent, document */

import forEach from 'lodash-es/forEach'
import filter from 'lodash-es/filter'
import 'custom-event-polyfill'

function eventEmitter (target) {
  target.prototype.eventHandlers = []
  target.prototype.on = function (eventName, eventCallback) {
    this.eventHandlers.push({
      name: eventName,
      callback: eventCallback
    })
  }
  target.prototype.receive = function (name, data) {
    forEach(filter(this.eventHandlers, {name: name}), (handler) => {
      handler.callback.apply(handler.callback, data)
    })
  }
  target.prototype.emit = function (name, data) {
    if (this.eventEmitReadyCallback()) {
      this.sendCustomEvent(name, data)
      this.eventEmitSendCallback({name: name, data: data})
    } else {
      this.eventQueue.push({name: name, data: data})
    }
  }
  target.prototype.emitStoredEvents = function () {
    forEach(this.eventQueue, (event) => {
      this.emit(true, event)
    })
  }
  target.prototype.sendCustomEvent = function (name, data) {
    document.dispatchEvent(new CustomEvent(name, {detail: data}))
  }

  return target
}

export default eventEmitter
