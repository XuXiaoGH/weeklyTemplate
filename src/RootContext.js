import React from 'react';
import weekList from "./source/weekList";
import UTIL from "./utils/util";

export default class RootContext extends React.Component {
  constructor() {
    super();
    const ONE_DAY = 24 * 60 * 60 * 1000;
    const dateList = [];
    const week = new Date().getDay();
    for (let i = 1; i <= week; i++) {
      dateList.push({
        label: weekList[i].label,
        value: UTIL.formatTimestamp(new Date().getTime() - ONE_DAY * (week - i), 'MM-dd')
      })
    }
    for (let i = week + 1; i <= 6; i++) {
      dateList.push({
        label: weekList[i].label,
        value: UTIL.formatTimestamp(new Date().getTime() + ONE_DAY * (i - week), 'MM-dd')
      })
    }
    dateList.push({
      label: '无',
      value: ' '
    });
    this.dateList = dateList;
    this.weekSign = UTIL.formatTimestamp(new Date().getTime(), 'yyyy') + dateList[0].value.replace('-', '');


  }
}
