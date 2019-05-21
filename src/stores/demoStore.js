/**
 * 演示store
 */

import { action, observable } from 'mobx';
import demoService from '../service/demo';

class DemoStore {
  // 一个state
  @observable list = [1, 2, 3];

  @action loadList() {
    demoService.getList().then((data) => {
      this.list = [...this.list, ...data];
    }).catch(() => {

    });
  }
}

export default new DemoStore();
