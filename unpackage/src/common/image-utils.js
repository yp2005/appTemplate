// const RALATIVE_PATH = '_downloads/';
import { RALATIVE_PATH, IMG_PLACEHOLD_PATH } from 'common/consts';
import logger from 'common/logUtils';
// eslint-disable-next-line
const asyncPath = async (imgUrl, dataName) => {
  let relativePath = RALATIVE_PATH + dataName + '_' + imgUrl.split('/').pop();
  let locaPath = await resolveLocalFileSystemURL(relativePath);
  console.log('locaPath:::' + locaPath);
  if (locaPath === undefined) {
    locaPath = await getImgFromNet(imgUrl, relativePath);
  }
  return locaPath;
};

/**
 * 获取图片本地文件
 * @param  {String}   imgUrl   图片url
 * @param  {Number}   index    数组索引
 * @param  {String}   dataName 数组对象名称，对应data里面的定义，可以直接使用self[dataName] 获取定义的数组
 * @param  {Function} cb       回调函数，更新数组对象用的
 * @return {String}            图片的本地绝对路径
 * @public
 */
const getImageLocalPath = (imgUrl, index, dataName, cb) => {
  let reg = /\.(png|jpe?g|gif|svg)(\?.*)?$/;
  if (imgUrl === undefined || imgUrl == null || imgUrl.indexOf('/') === -1 || !reg.test(imgUrl)) {
    cb(IMG_PLACEHOLD_PATH, index, dataName);
    return;
  }
  asyncPath(imgUrl, dataName).then(value => {
    cb(value, index, dataName);
  }).catch((err) => {
    logger.log('err:' + err.stack, 'getImageLocalPath asyncPath() error');
  });
};

/**
 * 根据path路径，访问本地文件系统，如果文件存在就返回绝对路径，否则抛出异常
 * @type {String} 文件的绝对路径
 * @private
 */
const resolveLocalFileSystemURL = path => {
  return new Promise((resolve, reject) => {
    plus.io.resolveLocalFileSystemURL(path, function(entry) {
      resolve(plus.io.convertLocalFileSystemURL(path));
    }, function(e) {
      reject(e);
    });
  }).catch((err) => {
    logger.log(path + 'resolveLocalFileSystemURL fail:' + err.stack, 'resolveLocalFileSystemURL() error');
  });
};

/**
 * 通过网络下载图片文件，当然也可以下载其他的静态资源文件
 * @param  {String} url  网络url
 * @param  {String} path 下载之后的本地路径
 * @return {String}      本地路径
 */
const getImgFromNet = (url, path) => {
  return new Promise((resolve, reject) => {
    plus.downloader.createDownload(url, {
      timeout: 5,
      retry: 0,
      filename: path
    //   ,retryInterval:3
    }, function(d, status) {
      if (status === 200) {
        // console.log('createDownload:' + plus.io.convertLocalFileSystemURL(path));
        resolve(plus.io.convertLocalFileSystemURL(path));
      } else {
        logger.log('download fail!' + path, 'getImgFromNet() error');
        reject(path);
      }
    }).start();
  }).catch(path => {
    delFile(path);
  });
};

/**
 * 删除文件
 * @type {String} 文件路径
 */
const delFile = relativePath => {
  plus.io.resolveLocalFileSystemURL(relativePath, function(entry) {
    entry.remove(function(entry) {
      logger.log('delFile sucess==' + relativePath, 'delFile() error');
    }, function(e) {
      logger.log('delFile fail==' + relativePath, 'delFile() error');
    });
  });
};

/**
 * 删除_downloads下面的全部文件
 * @return void
 */
const delAllFile = () => {
  plus.io.resolveLocalFileSystemURL(RALATIVE_PATH, function(entry) {
    entry.removeRecursively(function(entry) {
      logger.log('delAllFile sucess==' + RALATIVE_PATH, 'delAllFile() error');
    }, function(e) {
      logger.log('delAllFile fail==' + RALATIVE_PATH, 'delAllFile() error');
    });
  });
};

/**
 * 获取要删除文件的大小
 * @type {Function}  func回调函数
 * @return {Number} 图片大小
 */
const getFileSize = func => {
  // let rootPath = '_downloads';
  plus.io.resolveLocalFileSystemURL(RALATIVE_PATH, function(entry) {
    entry.getMetadata(function(metadata) {
      func(metadata.size);
    }, function(e) {
      logger.log(e.message, 'getFileSize() error');
    }, false);
  });
}

export default {
  delAllFile,
  getFileSize,
  getImageLocalPath
};
export { delAllFile, getFileSize, getImageLocalPath }
