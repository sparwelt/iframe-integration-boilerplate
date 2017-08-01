# iframe-integration-boilerplate
[![Build Status](https://api.travis-ci.org/sparwelt/iframe-integration-boilerplate.png?branch=master)](https://travis-ci.org/sparwelt/iframe-integration-boilerplate)

This is a boilerplate you can use if you want to dynamically include an iframe to provide some kind of service or widget.

It mostly uses & integrates https://github.com/davidjbradshaw/iframe-resizer while adding some common functionality and easing usage for a number of usecases.

## What does this do

* allows you to provide a simple js client for your iframe based application that allows
    * dynamic sizing
    * easy passing of variables ( set variables are translated as get parameters )
    * asynchronous initialization

## Integration

### Content Serving side

The side serving the content ( e.g. the one being integrated as iframe ) can simply use the host

```html
  (function(w, d, s, i) {
    var js, cjs = d.getElementsByTagName(s)[0]; if (d.getElementById(i)) return;
    w.iic=w.iic||function(){(iic.q=iic.q||[]).push(arguments)};iic.l=+new Date;
    js = d.createElement(s); js.i = i; js.src = "http://example-serving-side.com/dist/host.min.js"; cjs.parentNode.insertBefore(js, cjs);
  }(window, document, 'script', 'iih'));
```

### Integrating Side

The side integrating the iframe should load the `dist/client.js` provided here.

## Usage client.js

### Use as is
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
  }, 'http://example-serving-side.com/your-iframe-source.html', 'your-integration-placement']);

  // we get the client
  iic(function (client) {
    // we now have the client and can interact with it, no real functionality here as of now
  });
</script>
```

#### Synchronous Usage
If you want to use the script synchronously, thats also possibile

```html
<your-integration-placement></your-integration-placement>
<script src="http://example-serving-side.com/dist/client.js"></script>
<script>
    window.iframeIntegrationClient.render(
        {
            'your_option' : 'someValue',
            'another_option' : 'anotherValue'
        },
        'http://example-serving-side.com/your-iframe-source.html',
        'your-integration-placement'
    );
</script>
```

### Customize
To change the naming or preset your placement name & url simply modify the `app/client.js` file ( or create your own) and build the application.

### How to build the app
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
