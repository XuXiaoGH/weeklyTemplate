/**
 * mobx store
 */

import WeekStore from './weekStore';

class RootStore {
  constructor() {
    this.weekStore = new WeekStore(this);
  }
}

export default new RootStore();
