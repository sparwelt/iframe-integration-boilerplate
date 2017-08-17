/* global window */
import IframeIntegrationClient from './modules/IframeIntegrationClient'
import asyncClientGenerator from './modules/asyncClientGenerator'

// we generate our asynchronous client wrapper
asyncClientGenerator(
  window,
  IframeIntegrationClient,
  'iframeIntegrationClient',
  'iic',
  {
    targetUrl: 'http://davidjbradshaw.com/iframe-resizer/example/frame.content.html',
    cssSelector: 'iframe-integration-placement'
  }
)
