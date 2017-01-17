'use strict';
// import  from 'common/cacheUtils';
import API from 'api/';
/*global describe it*/
import utils, { localStorage, cookie, sessionStorage } from 'common/cacheUtils';

describe('api 单元测试', () => {
    it('api get()', () => {
        window.localStorage.clear();
        console.log(API.API_LOGIN.sms_code_send);
        console.log(API.PAGE_URL.forgot_password.id);
        API.API_LOGIN.sms_code_send.should.not.be.eql('http://localhost:8080/account/mobile/sms_code/send');
    //      API.API_LOGIN.sms_code_send.should.be.eql('http://www.jxdd.com/account/mobile/sms_code/send');
    //      API.API_LOGIN.sms_code_send.should.be.eql('http://www.jxdd.com/account/mobile/sms_code/send');
    //      API.STATIC_API.get_icons.should.be.eql('http://localhost:8080/suppliers/get_icons');
    //      API.STATIC_API.get_icons.should.be.eql('http://static.jxdd.com/suppliers/get_icons');
    });

    it('utils.localStorage.clear()', () => {
        utils.localStorage('lxm').clear();
        console.log(window.localStorage);
        console.log(localStorage('lxm').get('aa') === undefined);
    });
});

describe('cacheUtils localStorage 单元测试', () => {
    it('utils.localStorage(lxm)..get.set()', () => {
        utils.localStorage('lxm').set('aa', 'aa');
        console.log(window.localStorage);
        utils.localStorage('lxm').get('aa').should.be.eql('aa');
    });
    it('utils.localStorage.clear()', () => {
        utils.localStorage('lxm').clear();
        console.log(window.localStorage);
    //          utils.localStorage('lxm').get('aa').should.be.eql('');
    });
    it('utils.localStorage.getObject()', () => {
        utils.localStorage('lxm').setObject('test', {
            url: 'url',
            id: 'id',
            tt: localStorage('lxm').get('ss')
        });
        console.log('utils.localStorage.getObject():' + window.localStorage);
        //      utils.localStorage('lxm').get('test').url.should.not.be.eql('url');
        utils.localStorage('lxm').getObject('test').url.should.be.eql('url');
        utils.localStorage('lxm').getObject('test').id.should.be.eql('id');
        //      utils.localStorage('lxm').getObject('test').tt.should.not.be.eql('null');
        console.log('11111111111111111111' + (utils.localStorage('login').get('instance_id') === ''));
    });
    it('utils.localStorage array', () => {
        utils.localStorage('lxm').setObject('array',[
            'a','b','c','d'
        ]);
        console.log(window.localStorage);
        let aa = utils.localStorage('lxm').getObject('array');
        console.log(aa[2]);
        console.log(typeof aa);
    //          utils.localStorage('lxm').get('aa').should.be.eql('');
    });
});

describe('localStorage 单元测试', () => {
    it('localStorage(lxm).get.set()', () => {
        localStorage('lxm').set('aab', 'aab');
        console.log(window.localStorage);
        localStorage('lxm').get('aab').should.be.eql('aab');
    });
    it('localStorage.clear()', () => {
        localStorage('lxm').clear();
        console.log(window.localStorage);
    //      localStorage('lxm').get('aa').should.be.eql('');
    });
    it('localStorage.keys()', () => {
        localStorage('lxm').set('aab2', 'aab2');
        localStorage('lxm').set('aab', 'aab');
        let key = localStorage('lxm').key();
        console.log('keys:' + key);
        let keys = localStorage('lxm').keys();
        console.log('keys:' + keys);
        let values = localStorage('lxm').values();
        console.log('values:' + values);
        let length = localStorage('lxm').length();
        console.log('length:' + length);
        length.should.be.eql(3);
    });
});

describe('sessionStorage 单元测试', () => {
    it('sessionStorage(lxm).get.set()', () => {
        sessionStorage('lxm').set('aab', 'aab');
        console.log(window.sessionStorage);
        sessionStorage('lxm').get('aab').should.be.eql('aab');
    });
    it('sessionStorage.clear()', () => {
        sessionStorage('lxm').clear();
        console.log(window.sessionStorage);
    //      sessionStorage('lxm').get('aa').should.be.eql('');
    });
    it('sessionStorage.keys()', () => {
        sessionStorage('lxm').set('aab2', 'aab2');
        sessionStorage('lxm').set('aab', 'aab');
        let key = sessionStorage('lxm').key();
        console.log('keys:' + key);
        let keys = sessionStorage('lxm').keys();
        console.log('keys:' + keys);
        let values = sessionStorage('lxm').values();
        console.log('values:' + values);
        let length = sessionStorage('lxm').length();
        console.log('length:' + length);
        length.should.be.eql(2);
    });
    it('utils.sessionStorage.getObject()', () => {
        utils.sessionStorage('lxm').setObject('test', {
            url: 'url',
            id: 'id'
        });
        console.log(window.localStorage);
        //      utils.sessionStorage('lxm').get('test').url.should.not.be.eql('url');
        utils.sessionStorage('lxm').getObject('test').url.should.be.eql('url');
        utils.sessionStorage('lxm').getObject('test').id.should.be.eql('id');
    });
});

describe('cacheUtils cookie 单元测试', () => {
    it('utils.cookie().get()', () => {
        utils.cookie.set('aa', 'aa');
        console.log(document.cookie);
        utils.cookie.get('aa').should.be.eql('aa');
    });
    it('utils.cookie().clear()', () => {
        utils.cookie.clear();
        console.log(document.cookie);
    //      utils.cookie.get('aa').should.be.eql('');
    });
    it('utils.cookie().getObject()', () => {
        utils.cookie.setObject('test', {
            url: 'url',
            id: 'id'
        });
        console.log(document.cookie);
        //      utils.cookie.get('test').url.should.not.be.eql('url');
        utils.cookie.getObject('test').url.should.be.eql('url');
        utils.cookie.getObject('test').id.should.be.eql('id');
    });
});

describe('cacheUtils cookie 单元测试', () => {
    it('cookie()', () => {
        cookie.set('aa', 'aa');
        console.log(document.cookie);
        cookie.get('aa').should.be.eql('aa');
    });
    it('cookie()', () => {
        cookie.clear();
        console.log(document.cookie);
    //      cookie.get('aa').should.be.eql('');
    });
});
