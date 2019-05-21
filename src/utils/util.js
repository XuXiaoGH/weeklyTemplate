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
};
