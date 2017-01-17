/**
 * @file 通用过滤
 *
 * @Author zhongzhian
 *
 */

/**
 * 首页显示的行业的二级分类限定字数
 * num为需要限定的字数
 */
export const mysubstr = (value, num) => {
    if (!value) {
        return '';
    }
    if (value.length > num) {
        return value.substr(0, num);
    } else {
        return value;
    }
};

/**
 * 图片压缩过滤器，在传入的尺寸上×2
 * @param  {[type]} value =             ''  [图片路径]
 * @param  {[type]} size  =             100 [图片尺寸]
 * @return {[type]}       [压缩或者不压缩的图片路径]
 */
export const imageSizeFilter = (value = '', size = 100) => {
    let reg = /_\d{0,3}.(png|jpe?g|gif|svg)$/; // 避免重复处理导致路径不正确
    if (value.indexOf('http:') === 0 && !reg.test(value)) {
        let suffix = value.substring(value.lastIndexOf('.'));
        return `${value}_${size * 2}${suffix}`;
    }
    return value;
};

/**
 * 图片压缩过滤器，首页专用
 * @param  {[type]} value =             ''  [图片路径]
 * @param  {[type]} size  =             100 [图片尺寸]
 * @return {[type]}       [压缩或者不压缩的图片路径]
 */
export const imageSizeFilter4Home = (value = '', size = 360) => {
    let reg = /_\d{0,3}.(png|jpe?g|gif|svg)$/; // 避免重复处理导致路径不正确
    if (value.indexOf('http:') === 0 && !reg.test(value)) {
        let suffix = value.substring(value.lastIndexOf('.'));
        return `${value}_${size}${suffix}`;
    }
    return value;
};
