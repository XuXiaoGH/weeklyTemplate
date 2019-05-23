/**
 * 演示store
 */

import { action, observable } from 'mobx';
import demoService from '../service/demo';

class WeekStore {
  @observable report = {};

  @action setReport(data) {
    this.report = data;
  }
}

export default new WeekStore();
