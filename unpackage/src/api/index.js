'use strict';

/* API_ROOT */
const API_ROOT = 'http://localhost';

/**
 * api的版本，鉴于api的版本可能会出现不统一的情况，所以还是在url里面进行拼接
 */
/* eslint-disable no-unused-vars */
//const API_VERSION = 'v10';

const COMMON_API = {
	test_api: API_ROOT + 'test/1'
};

export default {
	COMMON_API
};