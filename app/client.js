/* global window */
import IframeIntegrationClient from './modules/IframeIntegrationClient'
import asyncClientGenerator from './modules/asyncClientGenerator'

/**
 *
 */
(asyncClientGenerator(
  window,
  IframeIntegrationClient,
  'iframeIntegrationClient',
  'iic',
  'iframeIntegrationAsyncInit',
  {
    targetUrl: 'http://davidjbradshaw.com/iframe-resizer/example/frame.content.html'
  },
  'iframe-integration-placement'
))
