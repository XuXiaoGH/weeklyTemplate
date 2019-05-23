import React from 'react';
import { inject, observer } from 'mobx-react';
import { hot } from 'react-hot-loader';
import Select from 'react-select';
import './index.less';

import UTIL from '../../utils/util';
import template from '../../source/template';
import statusList from '../../source/statusList';
import workerList from '../../source/workerList';
import weekList from '../../source/weekList';
import workType from "../../source/projectList";

const ONE_DAY = 24 * 60 * 60 * 1000;
const workerIdList = Object.keys(workerList);
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
console.log(dateList);
console.log(UTIL.formatTimestamp(new Date().getTime(), 'MM-dd'));


@inject('weekStore')
@observer
class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      newTemplate: UTIL.deepCopy(template)
    }
  }

  // 渲染项目
  getProject = (project, projectIndex, partIndex) => {
    return (
      <div className="project" key={projectIndex}>
        <div className="project-title paragraph">{project.label}</div>
        {
          project.list && project.list.map((item, itemIndex) => {
            return this.getItem(item, itemIndex, projectIndex, partIndex);
          })
        }
        <div className="item paragraph"><br /></div>
      </div>
    );
  };

  updateText = (obj) => {
    const {
      val, itemIndex, projectIndex, partIndex
    } = obj;
    const { newTemplate } = this.state;
    newTemplate[partIndex][projectIndex].list[itemIndex].text = val;
    this.setState({
      newTemplate
    });
  };

  updateStatus = (obj) => {
    const {
      newValue, itemIndex, projectIndex, partIndex
    } = obj;
    const { newTemplate } = this.state;
    newTemplate[partIndex][projectIndex].list[itemIndex].status = newValue.value;
    this.setState({
      newTemplate
    });
  };

  updateWeek = (obj) => {
    const {
      newValue, itemIndex, projectIndex, partIndex
    } = obj;
    const { newTemplate } = this.state;
    newTemplate[partIndex][projectIndex].list[itemIndex].date = newValue.value;
    this.setState({
      newTemplate
    });
  };

  updateWorker = (obj) => {
    const {
      val, itemIndex, projectIndex, partIndex, workerId
    } = obj;
    const { newTemplate } = this.state;
    const workerList = newTemplate[partIndex][projectIndex].list[itemIndex].worker;
    let aimIndex = -1;
    workerList.forEach((item, i) => {
      if (workerId === item) {
        aimIndex = i;
      }
    });
    if (val) {
      workerList.push(workerId);
    } else {
      workerList.splice(aimIndex, 1);
    }
    newTemplate[partIndex][projectIndex].list[itemIndex].worker = workerList;
    this.setState({
      newTemplate
    });
  };

  // 渲染每一个条目
  getItem = (item, itemIndex, projectIndex, partIndex) => {
    return (
      <div className="item paragraph" key={`${partIndex}${projectIndex}${itemIndex}`}>
        <textarea
          className="input"
          value={item.text}
          data-part-index={partIndex}
          data-project-index={projectIndex}
          data-item-index={itemIndex}
          onChange={(e) => {
            this.updateText({
              item, itemIndex, projectIndex, partIndex,
              val: e.target.value
            });
          }}
        />
        <Select
          className="select-status"
          value={statusList[Number(item.status)].value}
          searchable={false}
          clearable={false}
          options={Object.values(statusList)}
          onChange={(newValue) => {
            this.updateStatus({
              item, itemIndex, projectIndex, partIndex, newValue
            });
          }}
        />
        <Select
          className="select-time"
          value={item.date}
          searchable={false}
          clearable={false}
          options={dateList}
          placeholder={'时间'}
          onChange={(newValue) => {
            this.updateWeek({
              item, itemIndex, projectIndex, partIndex, newValue
            });
          }}
        />
        {/*{*/}
        {/*item.date && <span className="text">（{item.date}）</span>*/}
        {/*}*/}
        ；
        {
          <div className="worker">
            {
              Object.values(workerList).map((worker, i) => {

                const checkId = `checkbox${partIndex}${projectIndex}${itemIndex}${worker.value}`;
                const checked = item.worker.includes(worker.value);
                return (
                  <span className="check" key={checkId}>
                    <input
                      type="checkbox"
                      className="checkbox"
                      id={checkId}
                      checked={checked}
                      onChange={(e) => {
                        this.updateWorker({
                          item, itemIndex, projectIndex, partIndex,
                          workerId: worker.value,
                          val: e.target.checked
                        });
                      }}
                    />
                    <label
                      className={`label ${checked ? 'checked-label' : ''}`}
                      htmlFor={checkId}
                    > @{worker.label}
                    </label>
                  </span>
                );
              })
            }
          </div>
        }
      </div>);
  };

  addCore = () => {
    this.state.newTemplate[0].push({
      ...workType.balance,
      list: []
    });
    this.setState({
      newTemplate: this.state.newTemplate
    })

  };

  save = () => {
    this.props.weekStore.setReport(this.state.newTemplate);
  };

  render() {
    const { newTemplate } = this.state;
    return (
      <div className="edit-container">
        <button onClick={this.save}>save</button>
        <div className="core">
          <div className="title paragraph">核心工作要点: <button onClick={this.addCore}>add</button></div>
          {
            newTemplate[0].map((project, i) => {
              return this.getProject(project, i, 0);
            })
          }
        </div>
        <div className="problem">
          <div className="title paragraph">本周问题/故障：</div>
          {
            newTemplate[1] && newTemplate[1].length !== 0 && newTemplate[1].map((item, index) => {
              return this.getItem(item, index, 1, 1);
            })
          }
          {
            newTemplate[1] && newTemplate[1].length !== 0 &&
            <div className="item paragraph"><br /></div>
          }
        </div>
        <div className="detail">
          <div className="title paragraph">详细进展：</div>
          {
            newTemplate[2].map((project, i) => {
              return this.getProject(project, i, 0);
            })
          }
        </div>
        <div className="next">
          <div className="title paragraph">下周计划：</div>
          {
            newTemplate[3].map((project, i) => {
              return this.getProject(project, i, 0);
            })
          }
        </div>
      </div>
    );
  }
}

export default hot(module)(Home);
