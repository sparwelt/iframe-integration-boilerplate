# iframe-integration-boilerplate
This is a boilerplate you can use if you want to dynamically include an iframe to provide some kind of service or widget.

It mostly uses & integrates https://github.com/davidjbradshaw/iframe-resizer while adding some common functionality and easing usage for a number of usecases.

## What does this do

* allows you to provide a simple js client for your iframe based application that allows
    * dynamic sizing
    * easy passing of variables ( set variables are translated as get parameters )
    * asynchronous initialization

## Integration

### Content Serving side

The side serving the content ( e.g. the one being integrated as iframe ) can simply use the default iframe-resizer contentWindow client as part of its application or via CDN

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/3.5.14/iframeResizer.contentWindow.min.js"></script>
```

### Integrating Side

The side integrating the iframe should load the `dist/client.js` provided here.

## Usage client.js

### Use as is

You can simply use the script as is and provide your custom information on initialization

```html
<your-integration-placement></your-integration-placement>
<script src="http://example-serving-side.com/dist/client.js"></script>
<script>
    window.iframeIntegrationClient.render(
        {
            'your_option' : 'some value',
            'another_option' : 'another 
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

### Asynchronous Usage
The Client Script will call a method ( default `iframeIntegrationAsyncInit`) when it finished loading, allowing Asynchronous Usage, the name can be changed with an custom `app/client.js`  
```html
<your-integration-placement></your-integration-placement>
<script>
    var yourIntagrationCallback = function () {
        iframeIntegrationClient.render(
            {
                'your_option' : 'some value',
                'another_option' : 'another 
            },
            'http://example-serving-side.com/your-iframe-source.html',
            'your-integration-placement'
        );
    };
    
    if ('undefined' === swvapp) {
        window.iframeIntegrationAsyncInit = yourIntagrationCallback;
    } else {
        yourIntagrationCallback();
    }
    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "http://example-serving-side.com/dist/client.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'swvapp'));
</script>
```

## Things to keep in mind / known limitations

* the library also allows some event transmission, check the source of `app/IframeIntegrationClient.js` for details
* both pages must use https *or* http - no mixing
* the placement element ( `iframe-integration-placement` by default ) always needs to exist before the render method is called 