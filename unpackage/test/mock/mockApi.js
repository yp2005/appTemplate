var path = require('path')
var fs = require('fs');

var mockbase = './test/mock/data';
var mockApi = function(res, pathname, paramObj, next, req) {
	switch(pathname) {
		//by余鹏 测试数据
		case '/common/category/g1/v10': //jsonp
			var data = JSON.parse(fs.readFileSync(path.join(mockbase, 'typedata.json'), 'utf-8'));
			res.setHeader('Content-type', 'application/javascript');
			res.end(JSON.stringify(data));
			return;
		case '/market/purchasing/publish/v10': //jsonp
			var data = JSON.parse(fs.readFileSync(path.join(mockbase, 'releasebuying.json'), 'utf-8'));
			res.setHeader('Content-type', 'application/javascript');
			res.end(JSON.stringify(data));
			return;
		case '/market/purchasing/item/details/v10': //jsonp
			var data = JSON.parse(fs.readFileSync(path.join(mockbase, 'buyingInfo.json'), 'utf-8'));
			res.setHeader('Content-type', 'application/javascript');
			res.end(JSON.stringify(data));
			return;
		case '/store/v10/shipping/address/list': //jsonp
			var data = JSON.parse(fs.readFileSync(path.join(mockbase, 'address/shippingAddresses.json'), 'utf-8'));
			res.setHeader('Content-type', 'application/javascript');
			res.end(JSON.stringify(data));
			return;
		case '/store/v10/shipping/address/delete': //jsonp
			var data = JSON.parse(fs.readFileSync(path.join(mockbase, 'address/address_delete.json'), 'utf-8'));
			res.setHeader('Content-type', 'application/javascript');
			res.end(JSON.stringify(data));
			return;
		case '/store/v10/shipping/address/update': //jsonp
			var data = JSON.parse(fs.readFileSync(path.join(mockbase, 'address/address_save.json'), 'utf-8'));
			res.setHeader('Content-type', 'application/javascript');
			res.end(JSON.stringify(data));
			return;
		case '/store/v10/shipping/address/default': //jsonp
			var data = JSON.parse(fs.readFileSync(path.join(mockbase, 'address/address_set_default.json'), 'utf-8'));
			res.setHeader('Content-type', 'application/javascript');
			res.end(JSON.stringify(data));
			return;

		case '/store/v10/contract/add': //jsonp
			var data = JSON.parse(fs.readFileSync(path.join(mockbase, 'submitcontract.json'), 'utf-8'));
			res.setHeader('Content-type', 'application/javascript');
			res.end(JSON.stringify(data));
			return;

		case '/member/browse/history/v10': //jsonp
			var data = JSON.parse(fs.readFileSync(path.join(mockbase, 'mine/browse_history.json'), 'utf-8'));
			res.setHeader('Content-type', 'application/javascript');
			res.end(JSON.stringify(data));
			return;

		case '/member/delete/history/v10': //jsonp
			var data = JSON.parse(fs.readFileSync(path.join(mockbase, 'mine/delete_browse_history.json'), 'utf-8'));
			res.setHeader('Content-type', 'application/javascript');
			res.end(JSON.stringify(data));
			return;
		case '/store/get/store/info/v10': //jsonp
			var data = JSON.parse(fs.readFileSync(path.join(mockbase, 'store/storeInfo.json'), 'utf-8'));
			res.setHeader('Content-type', 'application/javascript');
			res.end(JSON.stringify(data));
			return;
			//by余鹏 测试数据 end
		default:
			;
	}
	next();
};

module.exports = mockApi;