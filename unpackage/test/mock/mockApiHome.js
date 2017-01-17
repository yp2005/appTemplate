var path = require('path');
var fs = require('fs');

var mockbase = './test/mock/data/home';
var data = null;
var mockApi = function(res, pathname, paramObj, next, req) {
    switch (pathname) {
    case '/market/buyer/homepage/v10': // 首页
        data = JSON.parse(fs.readFileSync(path.join(mockbase, 'home_page.json'), 'utf-8'));
        res.end(JSON.stringify(data));
        return;
    case '/home/index/slider/list/v10': // 首页轮播图片
        data = JSON.parse(fs.readFileSync(path.join(mockbase, 'slider_images.json'), 'utf-8'));
        res.end(JSON.stringify(data));
        return;
    case '/home/index/activity/list/v10': // 首页活动
        data = JSON.parse(fs.readFileSync(path.join(mockbase, 'activity_data.json'), 'utf-8'));
        res.end(JSON.stringify(data));
        return;
    case '/home/index/popular/list/v10': // 首页热门推荐
        data = JSON.parse(fs.readFileSync(path.join(mockbase, 'popular_recommend.json'), 'utf-8'));
        res.end(JSON.stringify(data));
        return;
    case '/market/get/customization/v10': // 更新行业定制
        data = JSON.parse(fs.readFileSync(path.join(mockbase, 'hangye_data.json'), 'utf-8'));
        res.end(JSON.stringify(data));
        return;
    case '/member/customer/favorite/list/v10': // 猜你喜欢
        data = JSON.parse(fs.readFileSync(path.join(mockbase, 'favorite_data.json'), 'utf-8'));
        res.end(JSON.stringify(data));
        return;
    default:
        ;
    }
    next();
};
module.exports = mockApi;
