import asyncClientGenerator from './modules/asyncClientGenerator'
import IframeIntegrationHost from './modules/IframeIntegrationHost'

// we generate our asynchronous host wrapper
(asyncClientGenerator(
  window,
  IframeIntegrationHost,
  'iframeIntegrationHost',
  'iih',
  {}
))
