const translate = require('../index')
const assert = require('assert')

describe('test request', () => {
    it('test request 1', done => {
        Promise
            .race([
                translate('hello', {from: 'en', to: 'zh-CN', cncom: 'cn'}),
                translate('hello', {from: 'en', to: 'zh-CN'})
            ])
            .then(res => {
                assert(res.text === '你好')
                assert(res.from.language.iso === 'en')
                assert(res.from.text.didYouMean === false)
                done()
            }).catch(err => {
                done(err)
            });
    })
})