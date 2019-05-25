import React from 'react';
import { inject, observer } from 'mobx-react';
import { hot } from 'react-hot-loader';
import Select from 'react-select';
import { Dialog } from '@ok/Dialog';
import './index.less';

import UTIL from '../../utils/util';
import template from '../../source/template';
import statusList from '../../source/statusList';
import workerList from '../../source/workerList';
import weekList from '../../source/weekList';

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
dateList.push({
  label: '无',
  value: ' '
})


@inject('weekStore')
@observer
class Home extends React.Component {
  constructor() {
    super();
    const localWeekly = JSON.parse(localStorage.getItem('weekly'));
    this.state = {
      newTemplate: localWeekly ? localWeekly : UTIL.deepCopy(template),
      currentWorker: '',
      showWorkerDialog: false
    }
  }

  componentDidMount() {

    const currentWorker = localStorage.getItem('currentWorker');
    if (!currentWorker) {
      this.setState({
        showWorkerDialog: true
      });
    } else {
      this.setState({
        currentWorker
      });
    }
  }

  // 渲染项目
  getProject = (project, projectIndex, partIndex) => {
    return (
      <div className="project" key={projectIndex}>
        <div className="project-title paragraph">{project.label}
          <span
            className="add-btn"
            onClick={() => {
              this.addItem({
                projectIndex, partIndex
              })
            }}
          >+
          </span>
        </div>
        <div>
          {
            project.list && project.list.map((item, itemIndex) => {
              return this.getItem({ item, itemIndex, projectIndex, partIndex });
            })
          }
        </div>
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
  getItem = ({ item, itemIndex, projectIndex, partIndex }) => {
    return (
      <div className="item paragraph" key={`${partIndex}${projectIndex}${itemIndex}`}>
        <div className="input-area">
          <textarea
            className="input"
            value={item.text}
            data-part-index={partIndex}
            data-project-index={projectIndex}
            data-item-index={itemIndex}
            placeholder={'工作描述：用简练的语言让一个不知道的人听明白'}
            onChange={(e) => {
              this.updateText({
                item, itemIndex, projectIndex, partIndex,
                val: e.target.value
              });
            }}
          />
          <Select
            className="select-status"
            value={statusList[Number(item.status)] ? statusList[Number(item.status)].value : "'"}
            searchable={false}
            clearable={false}
            options={Object.values(statusList)}
            placeholder={'状态'}
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
          {
            <span className="worker">
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
          </span>
          }
        </div>
        <span
          className="del-btn"
          onClick={() => {
            this.delItem({
              projectIndex, partIndex, itemIndex
            })
          }}
        >-
          </span>
      </div>
    );
  };

  addItem = ({ projectIndex, partIndex }) => {
    const { newTemplate } = this.state;
    newTemplate[partIndex][projectIndex].list.push({
      text: "",
      status: "",
      date: "",
      worker: [Number(this.state.currentWorker)],
    });
    this.setState({
      newTemplate
    })
  };


  delItem = ({ projectIndex, partIndex, itemIndex }) => {
    const { newTemplate } = this.state;
    newTemplate[partIndex][projectIndex].list.splice(itemIndex, 1);
    this.setState({
      newTemplate
    })
  };

  save = () => {
    this.props.weekStore.setReport(this.state.newTemplate);
    localStorage.setItem('weekly', JSON.stringify(this.state.newTemplate));
  };

  onConfirmWorker = () => {
    localStorage.setItem('currentWorker', this.state.currentWorker);
    this.setState({
      showWorkerDialog: false
    });
  };

  onChangeWorker = (newValue) => {
    this.setState({
      currentWorker: newValue.value
    });
  };


  render() {
    const { newTemplate } = this.state;
    const core = newTemplate[0];
    const problem = newTemplate[1];
    const detail = newTemplate[2];
    const next = newTemplate[3];
    return (
      <div className="edit-container">
        <div id="showKey" className="save-btn on" onClick={this.save}>保存</div>
        <div className="core">
          <div className="title paragraph">核心工作要点:</div>
          {
            core.map((project, i) => {
              return this.getProject(project, i, 0);
            })
          }
        </div>
        <div className="problem">
          <div className="title paragraph">本周问题/故障：
            <span
              className="add-btn"
              onClick={() => {
                this.addItem({
                  projectIndex: 0, partIndex: 1
                })
              }}
            >+
          </span>
          </div>
          <div>
            {
              problem[0].list.map((item, index) => {
                return this.getItem({ item, itemIndex: index, projectIndex: 0, partIndex: 1 });
              })
            }
          </div>
        </div>
        <div className="detail">
          <div className="title paragraph">详细进展：</div>
          {
            detail.map((project, i) => {
              return this.getProject(project, i, 2);
            })
          }
        </div>
        <div className="next">
          <div className="title paragraph">下周计划：
            <span
              className="add-btn"
              onClick={() => {
                this.addItem({
                  projectIndex: 0, partIndex: 3
                })
              }}
            >+
          </span>
          </div>
          <div>
            {
              next[0].list.map((item, index) => {
                return this.getItem({ item, itemIndex: index, projectIndex: 0, partIndex: 3 });
              })
            }
          </div>
        </div>

        <Dialog
          visible={this.state.showWorkerDialog}
          confirmText='确定'
          hideCloseBtn={true}
          onConfirm={this.onConfirmWorker}
        >
          <Select
            className="select-time"
            value={this.state.currentWorker}
            searchable={false}
            clearable={false}
            onChange={this.onChangeWorker}
            options={Object.values(workerList)}
            placeholder={'当前工作人员'}
          />
        </Dialog>
      </div>
    );
  }
}

export default hot(module)(Home);
