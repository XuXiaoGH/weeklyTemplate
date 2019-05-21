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

const workerIdList = Object.keys(workerList);


@inject('demoStore')
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
    if (!project.list || project.list.length === 0) {
      return null;
    }
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
      <div className="item paragraph" key={itemIndex}>
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
          className="select-status"
          value={1}
          searchable={false}
          clearable={false}
          options={Object.values(weekList)}
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
                console.log(worker)
                return (
                  <span className="check">
                    <input
                      type="checkbox"
                      id={`checkbox${partIndex}${projectIndex}${itemIndex}${worker.value}`}
                      checked={item.worker.includes(worker.value)}
                      onChange={(e) => {
                        this.updateWorker({
                          item, itemIndex, projectIndex, partIndex,
                          workerId: worker.value,
                          val: e.target.checked
                        });
                      }}
                    />
                    <label htmlFor={`checkbox${partIndex}${projectIndex}${itemIndex}${worker.value}`}>@{worker.label}</label>
                  </span>
                );
              })
            }
          </div>
        }
      </div>);
  };

  render() {
    const { newTemplate } = this.state;
    return (
      <div className="edit-container">
        <div className="core">
          <div className="title paragraph">核心工作要点:</div>
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
        </div>
        <div className="next">
          <div className="title paragraph">下周计划：</div>
        </div>
      </div>
    );
  }
}

export default hot(module)(Home);
