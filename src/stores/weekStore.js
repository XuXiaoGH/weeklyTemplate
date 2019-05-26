/**
 * 演示store
 */

import { action, observable } from 'mobx';
import week from '../source/weekList';
import status from '../source/statusList';
import worker from '../source/workerList';
import project from '../source/projectList';

export default class WeekStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable report = {};
  @observable statusList = status;
  @observable statusObj = {};
  @observable workerList = worker;
  @observable workerObj = {};
  @observable weekList = week;
  @observable projectList = project;
  @observable projectObj = {};
  @observable template = {};

  @observable got = false;

  @action setReport(data) {
    this.report = data;
  }

  @action init() {

    if (this.got) {
      return Promise.resolve();
    }

    let query = new window.AV.Query('project');
    let queryStatus = new window.AV.Query('status');
    let queryWorker = new window.AV.Query('worker');

    const reqArr = [query.find(), queryStatus.find(), queryWorker.find()];
    return Promise.all(reqArr).then((res) => {
      const project = {};
      const status = {};
      const worker = {};

      res[0].forEach((item) => {
        project[item.attributes.value] = item.attributes;
      });

      res[1].forEach((item) => {
        status[item.attributes.value] = item.attributes;
      });

      res[2].forEach((item) => {
        worker[item.attributes.value] = item.attributes;
      });
      this.projectList = project;
      this.statusList = status;
      this.workerList = worker;

      this.got = true;

    }).catch((error) => {
    });
  }
}
