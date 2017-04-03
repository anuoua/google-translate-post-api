# google-translate-post-api
google translate post api

## Features 

[google-translate-api](https://github.com/matheuss/google-translate-api) can't translate too long article, because of use `GET` request, i just change to `POST` way and add domain name setting for china.

## Install

```javasscript
npm install --save google-translate-post-api
```

## Usage

use `cncom` parameter to switch request if you are blocked by gfw.

``` js
const translate = require('google-translate-post-api');

translate('你好', {from: 'zh-cn', to: 'en', cncom: 'cn', raw: true}).then(res => {
    console.log(res.text);
    //=> I speak English
    console.log(res.from.language.iso);
    //=> nl
}).catch(err => {
    console.error(err);
});
```

## More detail

you can see [google-translate-api](https://github.com/matheuss/google-translate-api)

## License

MIT