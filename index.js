var querystring = require('querystring');

var fetch = require('node-fetch');
var safeEval = require('safe-eval');
var token = require('google-translate-cn-token');

var languages = require('./languages');

function translate(text, opts) {
    opts = Object.assign({
        cncom: 'com'
    }, opts);
    var e;
    [opts.from, opts.to].forEach(function (lang) {
        if (lang && !languages.isSupported(lang)) {
            e = new Error();
            e.code = 400;
            e.message = 'The language \'' + lang + '\' is not supported';
        }
    });
    if (e) {
        return new Promise(function (resolve, reject) {
            reject(e);
        });
    }

    opts.from = opts.from || 'auto';
    opts.to = opts.to || 'en';

    opts.from = languages.getCode(opts.from);
    opts.to = languages.getCode(opts.to);

    return token.getToken(text, opts.cncom).then(function (token) {
        var url = `https://translate.google.${opts.cncom}/translate_a/single`;
        var data = {
            client: 't',
            sl: opts.from,
            tl: opts.to,
            hl: opts.to,
            dt: ['at', 'bd', 'ex', 'ld', 'md', 'qca', 'rw', 'rm', 'ss', 't'],
            ie: 'UTF-8',
            oe: 'UTF-8',
            source: 'bh',
            ssel: 0,
            tsel: 0,
            kc: 1,
        };
        data[token.name] = token.value;

        url += '?' + querystring.stringify(data)

        return {
            url: url,
            text: text
        }

        // return url + '?' + querystring.stringify(data);
    }).then(function (data) {
        return fetch(data.url, {
            method: 'POST',
            timeout: 10000,
            body: `q=${encodeURIComponent(data.text)}`
        })
        .then(res => res.text())
        .then(function (res) {
            var result = {
                text: '',
                from: {
                    language: {
                        didYouMean: false,
                        iso: ''
                    },
                    text: {
                        autoCorrected: false,
                        value: '',
                        didYouMean: false
                    }
                },
                raw: ''
            };

            var body = safeEval(res);
            if (opts.raw) {
                result.raw = body;
            }
            body[0].forEach(function (obj) {
                if (obj[0] != null) {
                    result.text += obj[0];
                }
            });

            if (body[2] === body[8][0][0]) {
                result.from.language.iso = body[2];
            } else {
                result.from.language.didYouMean = true;
                result.from.language.iso = body[8][0][0];
            }

            if (body[7] != null && body[7][0] != null) {
                var str = body[7][0];

                str = str.replace(/<b><i>/g, '[');
                str = str.replace(/<\/i><\/b>/g, ']');

                result.from.text.value = str;

                if (body[7][5] === true) {
                    result.from.text.autoCorrected = true;
                } else {
                    result.from.text.didYouMean = true;
                }
            }

            return result;
        }).catch(function (err) {
            throw err;
        });
    });
}

module.exports = translate;
module.exports.languages = languages;
