# iframe-integration-boilerplate
[![Build Status](https://api.travis-ci.org/sparwelt/iframe-integration-boilerplate.png?branch=master)](https://travis-ci.org/sparwelt/iframe-integration-boilerplate)
[![NPM Version](https://badge.fury.io/js/%40sparwelt%2Fiframe-integration-boilerplate.svg)](https://www.npmjs.com/package/@sparwelt/iframe-integration-boilerplate)


This is a boilerplate you can use if you want to dynamically include an iframe to provide some kind of service or widget.

It mostly uses & integrates https://github.com/davidjbradshaw/iframe-resizer while adding some common functionality and easing usage for a number of usecases.

## What does this do

* allows you to provide a simple js client for your iframe based application that allows
    * dynamic sizing
    * easy passing of variables ( set variables are translated as get parameters )
    * asynchronous initialization on both ends

## Integration

### Content Serving side

The side serving the content ( e.g. the one being integrated as iframe ) can simply use the `dist/host.min.js` file

```html
<script>
  (function(w, d, s, i) {
    var js, cjs = d.getElementsByTagName(s)[0]; if (d.getElementById(i)) return;
    w.iih=w.iih||function(){(iih.q=iih.q||[]).push(arguments)};iih.l=+new Date;
    js = d.createElement(s); js.i = i; js.src = "http://example-serving-side.com/dist/host.min.js"; cjs.parentNode.insertBefore(js, cjs);
  }(window, document, 'script', 'iih'));
</script>
```

### Integrating Side - client.js

The side integrating the iframe should load the `dist/client.min.js` provided here.

#### Usage
You can simply use the script as is and provide your custom information on initialization
All Names and default values can be changed in the/with a custom `app/client.js` and by simply adapting the script below.  
```html
<your-integration-placement></your-integration-placement>
<script>
  (function(w, d, s, i) {
    var js, cjs = d.getElementsByTagName(s)[0]; if (d.getElementById(i)) return;
    w.iic=w.iic||function(){(iic.q=iic.q||[]).push(arguments)};iic.l=+new Date;
    js = d.createElement(s); js.i = i; js.src = "http://example-serving-side.com/dist/client.min.js"; cjs.parentNode.insertBefore(js, cjs);
  }(window, document, 'script', 'iic'));

  // we send some command to the client
  iic('render', [{
    'one_option': 'some_value',
    'another_option': 'another_value'
  }, {
    targetUrl: 'http://example-serving-side.com/your-iframe-source.html',
    localElementTagName: 'iframe-integration-placement'
  }]);

  // we get the client
  iic(function (client) {
    // we now have the client and can interact with it, no real functionality here as of now
  });
</script>
```
#### Methods
```javascript
/**
* @var object parameters  list of parameters passed via get to the target page
* @var object settings    list of settings about the workings of the iframe, all those default values can be set so this is for overriding & testing
*                         - targetUrl           what base url to load in the iframe
*                         - localElementTagName css selector of the element to transform
*                         - width               with of the element - default 100%
*                         + all settings avaiabile for the internal iframe resizer
*                         @see https://github.com/davidjbradshaw/iframe-resizer#options
*/
render({parameters}, {settings});
```
#### Properties
```javascript
/**
 * the iframe resize client itself for avaible methods see
 * @see https://github.com/davidjbradshaw/iframe-resizer#callback-methods
 */
iFrameResize
```

#### Customize
To change the naming or preset your placement name & url simply modify the `app/client.js` file ( or create your own) and build the application.

## How to build the app
Simply install all npm dependencies ( including dev dependencies ) and run build.

```bash
npm install
npm run build
```
if you want to use a different source `client.js` file
```bash
npm install
./node_modules/.bin/webpack app/your-client.js dist/client.js
```
`npm install` only needs to be run once of course.

## Things to keep in mind / known limitations
* (currently not working due to IE issues) the library also allows some event transmission, check the source of `app/IframeIntegrationClient.js` for details
* both pages must use https *or* http - no mixing
* the placement element ( `iframe-integration-placement` by default ) always needs to exist before the render method is called
* the iframe resizing event is first firedt after the host document finished loading, so optimize this page for an early `Load` event 

## Browser Support

Chrome|Firefox|IE|Opera|Safari
--- | --- | --- | --- | --- |
Latest|Latest|9+|Latest|6.1+|