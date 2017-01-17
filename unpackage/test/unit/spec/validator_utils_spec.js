'use strict';
import utils from 'common/validatorUtils.js';
/*global describe it*/
describe('validatorUtils email 单元测试 ', () => {
    it("email('lxm@123.com')", () => {
        utils.email('lxm@123.com').should.be.ok();
    });
    it("email('lxm123.com')", () => {
        utils.email('lxm123.com').should.not.be.ok();
    });
    it("email('lxm@123') 合法", () => {
        utils.email('lxm@123').should.be.ok();
    });
    it("email('test@test-.com') 不合法", () => {
        utils.email('test@test-.com').should.be.false('格式不合法');
    });
});

describe('validatorUtils ip 单元测试 ', () => {
    it("ip('1.1.1.1') 合法 ", () => {
        utils.ip('1.1.1.1').should.be.ok();
    });
    it("ip('1.255.1.1') 合法 ", () => {
        utils.ip('1.255.1.1').should.be.ok();
    });
    it("ip('192.168.1.1') 合法 ", () => {
        utils.ip('192.168.1.1').should.be.ok();
    });
    it("ip('333.1.1.1') 不合法 ", () => {
        utils.ip('333.1.1.1').should.be.false();
    });
});

describe('validatorUtils time 单元测试 ', () => {
    it("time('00:00') Valid time, lower bound ", () => {
        utils.time('00:00').should.be.ok();
    });
    it("time('23:59') Valid time, upper bound ", () => {
        utils.time('23:59').should.be.ok();
    });
    it("time('3:59') Valid time, single digit hour ", () => {
        utils.time('3:59').should.be.ok();
    });
    it("time('12') Invalid time ", () => {
        utils.time('12').should.not.be.ok();
    });
    it("time('29:59') Invalid time ", () => {
        utils.time('29:59').should.not.be.ok();
    });
});
describe('validatorUtils url 单元测试 ', () => {
    it("url('http://bassistance.de/jquery/plugin.php?bla=blu') Valid url ", () => {
        utils.url('http://bassistance.de/jquery/plugin.php?bla=blu').should.be.ok();
    });
    it("url('https://bassistance.de/jquery/plugin.php?bla=blu') Valid url ", () => {
        utils.url('https://bassistance.de/jquery/plugin.php?bla=blu').should.be.ok();
    });
    it("url('ftp://bassistance.de/jquery/plugin.php?bla=blu') Valid url ", () => {
        utils.url('ftp://bassistance.de/jquery/plugin.php?bla=blu').should.be.ok();
    });
    it("url('http://www.føtex.dk/') Valid url ", () => {
        utils.url('http://www.føtex.dk/').should.be.ok();
    });
    it("url('http://bösendorfer.de/') Valid url ", () => {
        utils.url('http://bösendorfer.de/').should.be.ok();
    });
    it("url('http://142.42.1.1') Valid url ", () => {
        utils.url('http://142.42.1.1').should.be.ok();
    });
    it("url('http://pro.photography') Valid url ", () => {
        utils.url('http://pro.photography').should.be.ok();
    });
    it("url('//code.jquery.com/jquery-1.11.3.min.js') Valid url ", () => {
        utils.url('//code.jquery.com/jquery-1.11.3.min.js').should.be.ok();
    });
    it("url('//142.42.1.1') Valid url ", () => {
        utils.url('//142.42.1.1').should.be.ok();
    });
    it("url('htp://code.jquery.com/jquery-1.11.3.min.js') Invalid url ", () => {
        utils.url('htp://code.jquery.com/jquery-1.11.3.min.js').should.not.be.ok();
    });
    it("url('http://192.168.8.') Invalid url ", () => {
        utils.url('http://192.168.8.').should.not.be.ok();
    });
    it("url('http://bassistance') Invalid url ", () => {
        utils.url('http://bassistance').should.not.be.ok();
    });
});
