/* global window */
import IframeIntegrationClient from './IframeIntegrationClient.js'

window.iframeIntegrationClient = new IframeIntegrationClient(
    'iframe-integration-placement',
    'http://davidjbradshaw.com/iframe-resizer/example/frame.content.html?'
)

if (typeof window.iframeIntegrationAsyncInit !== 'undefined') {
  window.iframeIntegrationAsyncInit(window.iframeIntegrationClient)
}
