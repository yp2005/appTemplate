'use strict';
/*!
 * consts.js v1.0.0
 * 常量列表js，主要是用来存一些常量，避免大家都各自在各个地方定义常量，便于统一管理<br>
 * 缓存的前缀和key需要注意，不能重复，所以，缓存的前缀，大家尽量按照模块名称来取，保证前缀不重复，例如登录的相关信息，前缀都用login
 * key也都在这里统一定义，这样就可以很明确的知道那些名字已经被占用了，已经存在了。
 * Author: liaoxm
 * Date: 2016-06-21
 * 使用方法：
 *        import CONSTS from 'common/consts.js'
 *        CONSTS.PREFIX_LOGIN
 */

/** **************缓存相关start*************************/
// 登录成功,用户相关信息
// 用户信息
const USER_INFO = 'user_info';

const ERROR_CODE = {
	SUCCESS: '10000', // 成功
};

export default {
	USER_INFO,
	ERROR_CODE

};
export {
	USER_INFO,
	ERROR_CODE
};