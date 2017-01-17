'use strict';
import utils from 'common/utils.js';
/*global describe it*/
describe('uuid() 方法测试', () => {
    it('utils.uuid()', () => {
        var uuid = utils.uuid();
        console.log('uuid v1:' + uuid);
        uuid.length.should.be.eql(36);
    });
    it('utils.uuidV4()', () => {
        var uuid = utils.uuidV4();
        console.log('uuid v4:' + uuid);
        uuid.length.should.be.eql(36);
    });
    it('utils.urlParam2Map()', () => {
        var url = '../../buyer/goodslist/goodslist.html?categoryName=商品分类&id=123123123';
        console.log('urlParam2Map:' + utils.urlParam2Map(url).id);
    //      uuid.length.should.be.eql(36);
    });
});

describe('md5() 方法测试', () => {
    it('utils.md5("mk2")', () => {
        utils.md5('mk2').should.be.eql('a683090976ec0f04dca81f6db9ca7484');
    });
    it("utils.md5(new Buffer(''))", () => {
        utils.md5(new Buffer('')).should.be.eql('d41d8cd98f00b204e9800998ecf8427e');
    });
    it("utils.md5(new Buffer('')) and utils.md5('')", () => {
        utils.md5(new Buffer('')).should.be.eql(utils.md5(''));
    });
    it("utils.md5('苏千')", () => {
        utils.md5('苏千').should.be.eql('5f733c47c58a077d61257102b2d44481');
    });
    it("utils.md5(new Buffer('苏千'))", () => {
        utils.md5(new Buffer('苏千')).should.be.eql('5f733c47c58a077d61257102b2d44481');
    });
    it("utils.md5('苏千', 'base64')", () => {
        utils.md5('苏千', 'base64').should.be.eql('X3M8R8WKB31hJXECstREgQ==');
    });
    it("utils.md5('123', 'base64')", () => {
        utils.md5('123', 'base64').should.be.eql('ICy5YqxZB1uWSwcVLSNLcA==');
    });
    it("utils.md5('', 'base64')", () => {
        utils.md5('', 'base64').should.be.eql('1B2M2Y8AsgTpgAmY7PhCfg==');
    });
    it("utils.md5({foo: 'bar', bar: 'foo'})", () => {
        utils.md5({
            foo: 'bar',
            bar: 'foo'
        }).should.be.eql('63a9d72936c6f7366fa5e72fa0cac8b4');
    });
    it("utils.md5({foo: 'bar', bar: 'foo'})", () => {
        utils.md5({
            foo: 'bar',
            bar: 'foo'
        }).should.be.eql(utils.md5({
            bar: 'foo',
            foo: 'bar'
        }));
    });
    it("utils.md5({foo: 'bar', bar: 'foo', v: [1, 2, 3]})", () => {
        utils.md5({
            foo: 'bar',
            bar: 'foo',
            v: [1, 2, 3]
        }).should.be.eql(utils.md5({
            v: [1, 2, 3],
            bar: 'foo',
            foo: 'bar'
        }));
    });
    it('utils.md5(复制对象)', () => {
        utils.md5({
            foo: 'bar',
            bar: 'foo',
            args: {
                age: 1,
                name: 'foo'
            },
            args2: {
                haha: '哈哈',
                bi: 'boo'
            },
            v: [1, 2, 3]
        }).should.be.eql(utils.md5({
            v: [1, 2, 3],
            bar: 'foo',
            foo: 'bar',
            args2: {
                bi: 'boo',
                haha: '哈哈'
            },
            args: {
                name: 'foo',
                age: 1
            }
        }));
    });
});

describe('sha1() 方法测试', () => {
    it("utils.sha1('mk2')", () => {
        utils.sha1('mk2').should.be.eql('0b1765f5e21e9d8a6da828ee59ce159c7d1a733e');
    });
    it("utils.sha1(new Buffer(''))", () => {
        utils.sha1(new Buffer('')).should.be.eql('da39a3ee5e6b4b0d3255bfef95601890afd80709');
    });
    it("utils.sha1(new Buffer('')) and utils.sha1('')", () => {
        utils.sha1(new Buffer('')).should.be.eql(utils.sha1(''));
    });
    it("utils.sha1('苏千')", () => {
        utils.sha1('苏千').should.be.eql('0a4aff6bab634b9c2f99b71f25e976921fcde5a5');
    });
    it("utils.sha1(new Buffer('苏千'))", () => {
        utils.sha1(new Buffer('苏千')).should.be.eql('0a4aff6bab634b9c2f99b71f25e976921fcde5a5');
    });
    it("utils.sha1('苏千', 'base64')", () => {
        utils.sha1('苏千', 'base64').should.be.eql('Ckr/a6tjS5wvmbcfJel2kh/N5aU=');
    });
    it("utils.sha1('123', 'base64')", () => {
        utils.sha1('123', 'base64').should.be.eql('QL0AFWMIX8NRZTKeof9cXsvbvu8=');
    });
    it("utils.sha1('', 'base64')", () => {
        utils.sha1('', 'base64').should.be.eql('2jmj7l5rSw0yVb/vlWAYkK/YBwk=');
    });
    it("utils.sha1({foo: 'bar', bar: 'foo'})", () => {
        utils.sha1({
            foo: 'bar',
            bar: 'foo'
        }).should.be.eql('91bb58051ed80d841941730c1f1399c9e0d8701b');
    });
});

describe('sha256() 方法测试', () => {
    it("utils.sha256('')", () => {
        utils.sha256('').should.be.eql('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
    });
    it("utils.sha256('123')", () => {
        utils.sha256('123').should.be.eql('a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3');
    });
    it("utils.sha256('哈哈中文')", () => {
        utils.sha256('哈哈中文').should.be.eql('0f9d15321510b57fc25b712de846c59cc541de89d47fcd06f6bfe1cd5ff2d7e3');
    });
    it("utils.sha256(new Buffer(''))", () => {
        utils.sha256(new Buffer('')).should.be.eql('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
    });
    it("utils.sha256(new Buffer('123'))", () => {
        utils.sha256(new Buffer('123')).should.be.eql('a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3');
    });
    it("utils.sha256(new Buffer('哈哈中文'))", () => {
        utils.sha256(new Buffer('哈哈中文')).should.be.eql('0f9d15321510b57fc25b712de846c59cc541de89d47fcd06f6bfe1cd5ff2d7e3');
    });
    it("utils.sha256(new Buffer('@Python发烧友'))", () => {
        utils.sha256(new Buffer('@Python发烧友')).should.be.eql('80ddd84d1453c994af764bf558c4b96adaced9dd8d7d2194705fe58e1b3162df');
    });
    it("utils.sha256(new Buffer('苏千'))", () => {
        utils.sha256(new Buffer('苏千')).should.be.eql('75dd03e3fcdbba7d5bec07900bae740cc8e361d77e7df8949de421d3df5d3635');
    });
});

describe('base64encode(), base64decode() 方法测试', () => {
    const text = utils.base64encode('哈哈中文 ok');
    const buf = utils.base64decode(text, 'buffer');
    it('编码解码', () => {
        Buffer.isBuffer(buf).should.be.ok();
    });
    it('编码解码 默认编码', () => {
        buf.toString().should.be.eql(utils.base64decode(text));
    });
    it('编码解码  指定编码', () => {
        buf.toString().should.be.eql(utils.base64decode(text, 'utf8'));
    });
});

describe('stringify() 方法测试', () => {
    let params = {
        aaa: '123',
        bbb: 456,
        ccc: [1, 2, 3]
    };
    it('aaa: "123"', () => {
        params = {
            aaa: '123'
        };
        console.log(utils.stringify(params));
    });
    it('bbb: 456', () => {
        params = {
            aaa: '123',
            bbb: 456
        };
        console.log(utils.stringify(params));
    });
    it('has [] ', () => {
        params = {
            aaa: '123',
            bbb: 456,
            ccc: [1, 2, 3]
        };
        console.log(utils.stringify(params));
    });
    it('has [json] ', () => {
        params = {
            aaa: '123',
            bbb: 456,
            ccc: [1, 2, 3],
            ddd: ['123', '234', '345']
        };
        let obj = {
            data: JSON.stringify(params),
            url: 'http://www.google.com'
        };
        console.log(utils.stringify(obj));
    });
    it('has [] ', () => {
        params = {
            aaa: '123',
            bbb: 456,
            ccc: [1, 2, 3],
            ddd: ['123', '234', '345']
        };
        let obj = {
            data: JSON.stringify(params),
            url: 'http://www.google.com'
        };
        console.log(utils.stringify(obj));
    });
    it('has [member_id] ', () => {
        params = {
            member_id: 'member_id',
            type: 3,
            collection_source: 2,
            goods_common_id: [10010]
        };
        let obj = {
            data: JSON.stringify(params),
            url: 'http://www.google.com'
        };
        console.log(utils.stringify(obj));
    });
});
