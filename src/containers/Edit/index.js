import React from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import Select from 'react-select';
import { Dialog } from '@ok/Dialog';
import Message from '@ok/Message';
import './index.less';
import RootContext from '../RootContext';
import Item from './Item';


@inject('weekStore')
@observer
class Home extends RootContext {
  constructor() {
    super();
    this.state = {
      newTemplate: null,
      currentWorker: '',
      showWorkerDialog: false
    };
  }

  componentWillMount() {
    const { weekStore } = this.props;
    weekStore.init().then((res) => {
      this.getWeekly();
    });
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

  componentWillUnmount() {
    // this.cancel();
  }

  // 获取周报
  getWeekly = () => {
    const { weekStore } = this.props;
    const newWeekly = {
      0: {},
      1: {},
      2: {},
      3: {},
    };
    const query = new window.AV.Query('weekly');
    query.equalTo('weekSign', this.weekSign);
    query.find().then((res) => {
      res.forEach((item) => {
        const {
          weekSign, part, project, sort, text, status, date, worker
        } = item.attributes;
        if (!newWeekly[part][project]) {
          newWeekly[part][project] = [];
        }
        newWeekly[part][project].push(Object.assign({ id: item.id }, item.attributes));
        newWeekly[part][project].sort((a, b) => {
          return a.sort - b.sort;
        });
      });

      weekStore.projectList && Object.values(weekStore.projectList).forEach((item) => {
        if (newWeekly[0] && !newWeekly[0][item.value] && item.isCore) {
          newWeekly[0][item.value] = [];
        }
        if (newWeekly[2] && !newWeekly[2][item.value]) {
          newWeekly[2][item.value] = [];
        }
      });
      // 初始化问题部分和下周计划部分
      newWeekly[1][0] = !newWeekly[1][0] ? [] : newWeekly[1][0];
      newWeekly[3][0] = !newWeekly[3][0] ? [] : newWeekly[3][0];
      this.setState({
        newTemplate: newWeekly
      });
      if (res.length === 0) {
        this.setWeekList();
      }
    }, (error) => {
    });
  };

  // 渲染项目
  getProject = (project, projectId, partId) => {
    const { weekStore } = this.props;
    return (
      <div className="project" key={projectId}>
        {
          weekStore && weekStore.projectList && weekStore.projectList[projectId] &&
          <div className="project-title paragraph">{weekStore.projectList[projectId].label}
            <span
              className="add-btn"
              onClick={() => {
                this.addItem({
                  projectId, partId
                });
              }}
            >+
            </span>
          </div>
        }
        <div>
          {
            project && project.map((item, itemIndex) => {
              return this.getItem({
                project, item, itemIndex, projectId, partId
              });
            })
          }
        </div>
      </div>
    );
  };

  updateText = (obj) => {
    const {
      val, itemIndex, projectId, partId
    } = obj;
    const { newTemplate } = this.state;
    newTemplate[partId][projectId][itemIndex].text = val;
    this.setState({
      newTemplate
    });
  };

  updateStatus = (obj) => {
    const {
      newValue, itemIndex, projectId, partId
    } = obj;
    const { newTemplate } = this.state;
    newTemplate[partId][projectId][itemIndex].status = newValue.value;
    this.setState({
      newTemplate
    });
  };

  updateWeek = (obj) => {
    const {
      newValue, itemIndex, projectId, partId
    } = obj;
    const { newTemplate } = this.state;
    newTemplate[partId][projectId][itemIndex].date = newValue.value;
    this.setState({
      newTemplate
    });
  };

  updateWorker = (obj) => {
    const {
      val, itemIndex, projectId, partId, workerId
    } = obj;
    const { newTemplate } = this.state;
    const newWorker = newTemplate[partId][projectId][itemIndex].worker;
    let aimIndex = -1;
    newWorker.forEach((item, i) => {
      if (workerId === item) {
        aimIndex = i;
      }
    });
    if (val) {
      newWorker.push(workerId);
    } else {
      newWorker.splice(aimIndex, 1);
    }
    newTemplate[partId][projectId][itemIndex].worker = newWorker;
    this.setState({
      newTemplate
    });
  };

  // 渲染每一个条目
  getItem = (props) => {
    const { weekStore } = this.props;
    const { statusList, workerList } = weekStore;
    return (
      <Item
        key={props.itemIndex}
        {...props}
        statusList={statusList}
        workerList={workerList}
        refresh={this.getWeekly}
        delItem={this.delItem}
        addItem={this.addItem}
        updateText={this.updateText}
        updateStatus={this.updateStatus}
        updateWeek={this.updateWeek}
        updateWorker={this.updateWorker}
      />
    );
  };


  addItem = ({ projectId, partId }) => {
    const { newTemplate } = this.state;
    newTemplate[partId][projectId].push({
      text: '',
      status: '',
      date: '',
      worker: [Number(this.state.currentWorker)],
    });
    this.setState({
      newTemplate
    });
  };


  delItem = ({
    item, projectId, partId, itemIndex
  }) => {
    const { newTemplate } = this.state;
    newTemplate[partId][projectId].splice(itemIndex, 1);
    this.setState({
      newTemplate
    });
    const { id } = item;
    if (id) {
      window.AV.Object.createWithoutData('weekly', id).destroy().then((success) => {
        this.getWeekly();
        Message.success({ content: '删除成功' });
      }, (error) => {
        Message.success({ content: '删除失败' });
      });
    }
  };

  onConfirmWorker = () => {
    if (!this.state.currentWorker) {
      return;
    }
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
    if (!newTemplate) {
      return null;
    }
    const { weekStore } = this.props;
    const { workerList } = weekStore;
    const core = newTemplate[0];
    const problem = newTemplate[1];
    const detail = newTemplate[2];
    const next = newTemplate[3];
    return (
      <div className="edit-container">
        {
          this.state.currentWorker &&
          <div>
            <Link id="showKey" className="save-btn on" to="/">返回查看</Link>
            <div className="core">
              <div className="title paragraph">核心工作要点:</div>
              {
                Object.entries(core).map((project) => {
                  return this.getProject(project[1], project[0], 0);
                })
              }
            </div>
            <div className="problem">
              <div className="title paragraph">本周问题/故障：
                <span
                  className="add-btn"
                  onClick={() => {
                    this.addItem({ projectId: 0, partId: 1 });
                  }}
                >+
                </span>
              </div>
              <div>
                {
                  problem[0] && problem[0].map((item, index) => {
                    return this.getItem({
                      project: problem[0], item, itemIndex: index, projectId: 0, partId: 1
                    });
                  })
                }
              </div>
            </div>
            <div className="detail">
              <div className="title paragraph">详细进展：</div>
              {
                Object.entries(detail).map((project) => {
                  return this.getProject(project[1], project[0], 2);
                })
              }
            </div>
            <div className="next">
              <div className="title paragraph">下周计划：
                <span
                  className="add-btn"
                  onClick={() => {
                    this.addItem({ projectId: 0, partId: 3 });
                  }}
                >+
                </span>
              </div>
              <div>
                {
                  next[0] && next[0].map((item, index) => {
                    return this.getItem({
                      project: next[0], item, itemIndex: index, projectId: 0, partId: 3
                    });
                  })
                }
              </div>
            </div>
          </div>
        }

        <Dialog
          visible={this.state.showWorkerDialog}
          confirmText="确定"
          hideCloseBtn
          onConfirm={this.onConfirmWorker}
        >
          <Select
            className="select-time"
            value={this.state.currentWorker}
            searchable={false}
            clearable={false}
            onChange={this.onChangeWorker}
            options={Object.values(workerList)}
            placeholder="当前工作人员"
          />
          <div className="tips">选错了自己清localStorage</div>
        </Dialog>
      </div>
    );
  }
}

export default hot(module)(Home);
