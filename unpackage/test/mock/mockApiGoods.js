var path = require('path');
var fs = require('fs');

var mockbase = './test/mock/data/goods';
var data = null;
var mockApi = function(res, pathname, paramObj, next, req) {
    switch (pathname) {
    case '/store/shipping/template/list/v10':
        data = JSON.parse(fs.readFileSync(path.join(mockbase, 'shipmentdata.json'), 'utf-8'));
        res.end(JSON.stringify(data));
        return;
    case '/common/category/g123/v10':
        data = JSON.parse(fs.readFileSync(path.join(mockbase, 'category.json'), 'utf-8'));
        res.end(JSON.stringify(data));
        return;
    case '/goods/mobile/search/v10':
        var start = '0';
        paramObj = paramObj || {};
        if (paramObj.row_start_number) {
            start = paramObj.row_start_number;
        }
        data = JSON.parse(fs.readFileSync(path.join(mockbase, 'goodsdata.json'), 'utf-8'));
        var page = ~~(start);
        console.log('page:::::' + page);
            // 造数据
            // 清理样例数据
        data.items = [];
        data.row_start_number = page;
        var dataStart = page;
        for (var index = 0; index < data.row_count; index++) {
            if ((page + index) > data.total_row_number - 1) {
                break;
            }
            var item = {};
            item['image_url'] = 'http://vuejs.org.cn/images/logo.png';
            item['goods_id'] = dataStart + index;
            item['goods_name'] = (index % 3 === 0 ? '商品名称比较长超过十个字了' : '商品名称比较短') + (dataStart + index);
            var price = index % 5 === 0 ? ((dataStart + index) * 10000 + dataStart + index) : ((dataStart + index) * 10 + dataStart + index);
            item['goods_price'] = price === 0 ? 123 : price;
            item['goods_volumes'] = index % 5 === 0 ? ((dataStart + index) * 100000 + dataStart + index) : ((dataStart + index) * 10 + dataStart + index);
            item['browse_count'] = index % 5 === 0 ? ((dataStart + index) * 10000 + dataStart + index) : ((dataStart + index) * 10 + dataStart + index);
            data.items.push(item);
        }

        var sortKind = paramObj.sort_kind || 0;
        var ss = ['', 'goods_id', 'goods_price', 'goods_volumes'][parseInt(sortKind)];
        var sortArrow = (paramObj.sort_arrow || 0) > 1 ? 1 : 0;
        data.items.sort(orderBy(ss, sortArrow));
        res.setHeader('Content-Type', 'application/json');
        console.log('JSON.stringify(data):', JSON.stringify(data));
        res.end(JSON.stringify(data));
        return;
    default:
        ;
    }
    next();
};

/**
 * 函数接受一个成员名字符串和一个可选的次要比较函数做为参数
 * 并返回一个可以用来包含该成员的对象数组进行排序的比较函数
 * 当主要属性相等时，次要比较函数被用来决出高下
 * @param  {String} name  属性名称
 * @param  {String} minor 次要属性
 * @param  {Number} asc  排序规则，0升序，1降序，默认0
 * @return {void}
 */
const orderBy = (name, minor, asc) => (o, p) => {
    var a,
        b;
    if (typeof minor === 'function') {
        asc = asc || 0;
    } else {
        asc = minor || 0;
    }

    if (o && p && typeof o === 'object' && typeof p === 'object') {
        a = o[name];
        b = p[name];
        if (a === b) {
            return typeof minor === 'function' ? minor(o, p) : 0;
        }
        if (typeof a === typeof b) {
            return a > b ? (asc ? -1 : 1) : (asc ? 1 : -1);
        }
        // 类型不一致，就按照类型进行分组
        return typeof a > typeof b ? (asc ? -1 : 1) : (asc ? 1 : -1);
    } else {
        throw new Error('error');
    }
};

module.exports = mockApi;
