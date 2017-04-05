import translate, { languages } from './index'

describe('test request', () => {
    it('test request 1', done => {
        Promise
            .race([
                translate('hello', {from: 'en', to: 'zh-CN', cncom: 'cn'}),
                translate('hello', {from: 'en', to: 'zh-CN'})
            ])
            .then(res => {
                console.log(res.text)
                console.log(res.from.language.iso)
                console.log(res.from.text.didYouMean);
                done()
            }).catch(err => {
                done(err)
            });
    })
})