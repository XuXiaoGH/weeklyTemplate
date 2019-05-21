/**
 *
 */
import dataProxy from '../dataProxy';

export default {
  getList() {
    return dataProxy.get('/ddd').then(() => {
      return [4, 5, 6, 7, 8, 10];
    }).catch(() => {
      return [4, 5, 6, 7, 8, 10];
    });
  }
};
