/* global window */
import IframeIntegrationClient from './IframeIntegrationClient.js'

window.iframeIntegrationClient = new IframeIntegrationClient(
  'http://davidjbradshaw.com/iframe-resizer/example/frame.content.html?',
  'iframe-integration-placement'
)

if (typeof window.iframeIntegrationAsyncInit !== 'undefined') {
  window.iframeIntegrationAsyncInit(window.iframeIntegrationClient)
}
