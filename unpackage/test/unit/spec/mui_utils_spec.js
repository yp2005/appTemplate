'use strict';
import merge from 'webpack-merge';
import utils from 'common/utils';
import muiUtils from 'common/muiUtils';

/*global describe it*/
describe('merge 单元测试', () => {
    it('merge()key undefined', () => {
        let o = {};
        let options = {
            styles: {
                popGesture: 'close'
            },
            show: {
                autoShow: true,
                aniShow: 'pop-in',
                duration: 500
            },
            waiting: {
                autoShow: false // 自动显示等待框，默认为true
            }
        };
        options = merge(o.options || {}, options);
        console.log('merge()key undefined:' + utils.stringify(options));
    });
    it('merge() value undefined', () => {
        let o = {
            styles: {
                popGesture: 'close'
            },
            show: {
                autoShow: true,
                aniShow: 'pop-in',
                duration: 500
            },
            waiting: {
                autoShow: false // 自动显示等待框，默认为true
            }
        };
        let options = merge(o, options || {});
        console.log('merge() value undefined:' + utils.stringify(options));
    });
    it('merge() has value', () => {
        let o = {
            options: {
                waiting: {
                    autoShow: true
                }
            }
        };
        let options = {
            styles: {
                popGesture: 'close'
            },
            show: {
                autoShow: true,
                aniShow: 'pop-in',
                duration: 500
            },
            waiting: {
                autoShow: false // 自动显示等待框，默认为true
            }
        };
        options = merge(o.options, options || {});
        console.log('merge() has value: ' + utils.stringify(options));
    });
});

describe('dataFormat 单元测试', () => {
    it('dataFormat', () => {
        var data = {
            'header': {
                'code': '200000',
                'msg': '服务调用成功'
            },
            'g1': [{
                'g1_image': 'http://vuejs.org.cn/images/logo.png',
                'g1_code': '11',
                'g1_name': '一级类目',
                'description': 'description',
                'g2': [{
                    'g2_image': 'http://vuejs.org.cn/images/logo.png',
                    'g2_code': '21',
                    'g2_name': '二级类目',
                    'description': 'description',
                    'g3': [{
                        'g3_image': 'http://vuejs.org.cn/images/logo.png',
                        'g3_code': '31',
                        'g3_name': '3级类目1',
                        'description': 'description'

                    }, {
                        'g3_image': 'http://vuejs.org.cn/images/logo.png',
                        'g3_code': '31',
                        'g3_name': '3级类目2',
                        'description': 'description'

                    }, {
                        'g3_image': 'http://vuejs.org.cn/images/logo.png',
                        'g3_code': '31',
                        'g3_name': '3级类目3',
                        'description': 'description'

                    }, {
                        'g3_image': 'http://vuejs.org.cn/images/logo.png',
                        'g3_code': '31',
                        'g3_name': '3级类目4',
                        'description': 'description'

                    }, {
                        'g3_image': 'http://vuejs.org.cn/images/logo.png',
                        'g3_code': '31',
                        'g3_name': '3级类目5',
                        'description': 'description'

                    }]
                }]
            }, {
                'g1_image': 'http://vuejs.org.cn/images/logo.png',
                'g1_code': '11',
                'g1_name': '一级类目',
                'description': 'description',
                'g2': [{
                    'g2_image': 'http://vuejs.org.cn/images/logo.png',
                    'g2_code': '21',
                    'g2_name': '二级类目',
                    'description': 'description',
                    'g3': [{
                        'g3_image': 'http://vuejs.org.cn/images/logo.png',
                        'g3_code': '31',
                        'g3_name': '3级类目1',
                        'description': 'description'

                    }, {
                        'g3_image': 'http://vuejs.org.cn/images/logo.png',
                        'g3_code': '31',
                        'g3_name': '3级类目2',
                        'description': 'description'

                    }, {
                        'g3_image': 'http://vuejs.org.cn/images/logo.png',
                        'g3_code': '31',
                        'g3_name': '3级类目3',
                        'description': 'description'

                    }, {
                        'g3_image': 'http://vuejs.org.cn/images/logo.png',
                        'g3_code': '31',
                        'g3_name': '3级类目4',
                        'description': 'description'

                    }, {
                        'g3_image': 'http://vuejs.org.cn/images/logo.png',
                        'g3_code': '31',
                        'g3_name': '3级类目5',
                        'description': 'description'

                    }]
                }]
            }, {
                'g1_image': 'http://vuejs.org.cn/images/logo.png',
                'g1_code': '11',
                'g1_name': '一级类目',
                'description': 'description',
                'g2': [{
                    'g2_image': 'http://vuejs.org.cn/images/logo.png',
                    'g2_code': '21',
                    'g2_name': '二级类目',
                    'description': 'description',
                    'g3': [{
                        'g3_image': 'http://vuejs.org.cn/images/logo.png',
                        'g3_code': '31',
                        'g3_name': '3级类目1',
                        'description': 'description'

                    }, {
                        'g3_image': 'http://vuejs.org.cn/images/logo.png',
                        'g3_code': '31',
                        'g3_name': '3级类目2',
                        'description': 'description'

                    }, {
                        'g3_image': 'http://vuejs.org.cn/images/logo.png',
                        'g3_code': '31',
                        'g3_name': '3级类目3',
                        'description': 'description'

                    }, {
                        'g3_image': 'http://vuejs.org.cn/images/logo.png',
                        'g3_code': '31',
                        'g3_name': '3级类目4',
                        'description': 'description'

                    }, {
                        'g3_image': 'http://vuejs.org.cn/images/logo.png',
                        'g3_code': '31',
                        'g3_name': '3级类目5',
                        'description': 'description'

                    }]
                }]
            }, {
                'g1_image': 'http://vuejs.org.cn/images/logo.png',
                'g1_code': '11',
                'g1_name': '一级类目',
                'description': 'description',
                'g2': [{
                    'g2_image': 'http://vuejs.org.cn/images/logo.png',
                    'g2_code': '21',
                    'g2_name': '二级类目',
                    'description': 'description',
                    'g3': [{
                        'g3_image': 'http://vuejs.org.cn/images/logo.png',
                        'g3_code': '31',
                        'g3_name': '3级类目1',
                        'description': 'description'

                    }, {
                        'g3_image': 'http://vuejs.org.cn/images/logo.png',
                        'g3_code': '31',
                        'g3_name': '3级类目2',
                        'description': 'description'

                    }, {
                        'g3_image': 'http://vuejs.org.cn/images/logo.png',
                        'g3_code': '31',
                        'g3_name': '3级类目3',
                        'description': 'description'

                    }, {
                        'g3_image': 'http://vuejs.org.cn/images/logo.png',
                        'g3_code': '31',
                        'g3_name': '3级类目4',
                        'description': 'description'

                    }, {
                        'g3_image': 'http://vuejs.org.cn/images/logo.png',
                        'g3_code': '31',
                        'g3_name': '3级类目5',
                        'description': 'description'

                    }]
                }]
            }, {
                'g1_image': 'http://vuejs.org.cn/images/logo.png',
                'g1_code': '11',
                'g1_name': '一级类目',
                'description': 'description',
                'g2': [{
                    'g2_image': 'http://vuejs.org.cn/images/logo.png',
                    'g2_code': '21',
                    'g2_name': '二级类目',
                    'description': 'description',
                    'g3': [{
                        'g3_image': 'http://vuejs.org.cn/images/logo.png',
                        'g3_code': '31',
                        'g3_name': '3级类目1',
                        'description': 'description'

                    }, {
                        'g3_image': 'http://vuejs.org.cn/images/logo.png',
                        'g3_code': '31',
                        'g3_name': '3级类目2',
                        'description': 'description'

                    }, {
                        'g3_image': 'http://vuejs.org.cn/images/logo.png',
                        'g3_code': '31',
                        'g3_name': '3级类目3',
                        'description': 'description'

                    }, {
                        'g3_image': 'http://vuejs.org.cn/images/logo.png',
                        'g3_code': '31',
                        'g3_name': '3级类目4',
                        'description': 'description'

                    }, {
                        'g3_image': 'http://vuejs.org.cn/images/logo.png',
                        'g3_code': '31',
                        'g3_name': '3级类目5',
                        'description': 'description'

                    }]
                }]
            }]
        };
        dataFormat(data.g1);
    });
});

describe('muiAjax 单元测试', () => {
    it('dataFormat', () => {
        let params = {
            'store_id': 2,
            'member_id': 3456,
            'goods_items': [{
                'goods_id': 123769,
                'buy_quantity': 1,
                'goods_price': '6',
                'sum_price': '6'
            }
            ]
        };
        muiUtils.muiAjax('http://192.168.2.98:8000/common/category/g123/v10', {
            data: JSON.stringify(params),
            dataType: 'json',
            contentType: 'application/json',
            type: 'post',
            success: function(data) {
                console.log(data.header.code);
            }
        });
    });
});

const dataFormat2 = function(data, g) {
    data = data || [];
    var temp = {};
    var result = [];
    data.map(
        item => {
            temp = {
                value: item['g' + g + '_code'],
                text: item['g' + g + '_name'],
                children: (g === 3) ? {} : (dataFormat2(item['g' + (g + 1)], g + 1) || {})
            };
            result.push(temp);
        }
    );
    return result;
};

const dataFormat = function(data) {
    var temp = {};
    var result = [];
    data = data || [];
    data.sort().map(
        item => {
            temp = {
                value: item.g1_code,
                text: item.g1_name,
                children: dataFormat2(item.g2, 2) || {}
            };
            result.push(temp);
        }
    );
    console.log(JSON.stringify(result), 'goodspublish app.vue dataFormat()');
    return result;
};
