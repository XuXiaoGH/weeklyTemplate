/**
 * 工具方法模块
 */

export default {
  deepCopy(obj) {
    try {
      // 终止条件，如果不是对象就放回该值
      if (typeof obj !== 'object' || obj === null) {
        return obj;
      }
      const newObj = (obj.constructor === Array) ? [] : {};
      Object.keys(obj).forEach((key) => {
        // 利用递归的方式
        newObj[key] = this.deepCopy(obj[key]);
      });
      return newObj;
    } catch (e) {
      console.log(e);
      return null;
    }
  },

  /**
   * 格式化timestamp
   * @param  timestamp
   * @param  {string} format    格式字符串, 如 yyyy-MM-dd, yyyy-MM-dd hh:mm:ss
   * @return {string}           格式化后的字符串
   */
  formatTimestamp(timestamp, format) {
    const inputDate = new Date(timestamp);
    const date = {
      'M+': inputDate.getMonth() + 1,
      'd+': inputDate.getDate(),
      'h+': inputDate.getHours(),
      'm+': inputDate.getMinutes(),
      's+': inputDate.getSeconds(),
      'q+': Math.floor((inputDate.getMonth() + 3) / 3),
      'S+': inputDate.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
      format = format.replace(RegExp.$1, inputDate.getFullYear().toString().substr(4 - RegExp.$1.length));
    }
    for (const k in date) {
      if (new RegExp(`(${k})`).test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ((`00${date[k]}`).substr((`${date[k]}`).length)));
      }
    }
    return format;
  },
};
