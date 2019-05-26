import React from 'react';
import { inject, observer } from 'mobx-react';
import { hot } from 'react-hot-loader';
import { Link } from 'react-router-dom'
import './index.less';

import RootContext from "../../RootContext";

@inject('weekStore')
@observer
class Home extends RootContext {

  constructor() {
    super();
    this.state = {
      currentWorker: null
    }
  }

  componentWillMount() {
    const { weekStore } = this.props;
    weekStore.init().then(() => {
      this.getWeekly();
    });
  }

  // 获取周报
  getWeekly = () => {
    const { weekStore } = this.props;
    let query = new window.AV.Query('weekly');
    const newWeekly = {
      0: {},
      1: {},
      2: {},
      3: {},
    };
    query.equalTo('weekSign', this.weekSign);
    query.find().then((res) => {
      res.forEach((item) => {
        const { weekSign, part, project, sort, text, status, date, worker } = item.attributes;
        if (!newWeekly[part][project]) {
          newWeekly[part][project] = [];
        }
        newWeekly[part][project].push(Object.assign({ id: item.id }, item.attributes));
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
      }, () => {
      });
    }, (error) => {
    });
  };

  // 渲染项目
  getProject = ({ project, showWorker, isCore }) => {
    const { weekStore } = this.props;
    if (!project[1] || project[1].length === 0) {
      return null;
    }
    const { currentWorker } = this.state;
    return (
      <div className="project" key={project[0]}>
        {!(currentWorker && isCore) && <div className="project-title paragraph">{weekStore.projectList[project[0]].label}：</div>}
        {
          project[1] && project[1].map((item, index) => {
            return this.getItem({ item, index, showWorker });
          })
        }
        <div className="item paragraph"><br /></div>
      </div>
    );
  };

  // 渲染每一个条目
  getItem = ({ item, index, showWorker }) => {
    const { weekStore } = this.props;
    const { statusList, workerList } = weekStore;
    const { currentWorker } = this.state;
    let show = showWorker && !currentWorker;
    return (
      <div className="item paragraph" key={index}>
        <span className="index">{index + 1}. </span>
        <span className="text">{item.text}</span>
        {
          item.status && statusList[item.status] && <span className="text">，{statusList[item.status].label}</span>
        }
        {
          String(item.date).trim() && <span className="text">（{item.date}）</span>
        }
        {
          show && item.worker && item.worker.length !== 0 &&
          <span className="worker">
          {
            item.worker.map((worker, i) => {
              if (!workerList[worker]) {
                return null;
              }
              return (
                <span className="worker" key={i}> @{workerList[worker].label}</span>
              );
            })
          }
        </span>
        }
        ；
      </div>
    );
  };

  onChangeWorker = (currentWorker) => {
    this.setState({
      currentWorker: this.state.currentWorker === currentWorker ? null : currentWorker
    })
  };

  // 过滤每个人的周报
  filterWeekly = () => {
    const weekly = this.state.newTemplate;
    if (!weekly) {
      return null;
    }
    const { currentWorker } = this.state;
    if (!currentWorker) {
      return weekly;
    }
    return Object.values(weekly).map((part) => {
      // 遍历部分
      return Object.entries(part).map((project) => {
        const newProject = [];
        // 遍历项目
        project[1].forEach((item) => {

          if (item.worker.includes(currentWorker)) {
            newProject.push(item);
          }
        });
        return newProject;
      })
    });
  };

  filterCore = (core) => {
    const newCore = { 0: [] };
    Object.entries(core).forEach((project) => {
      project[1].forEach((item) => {
        newCore[0].push(item);
      });
    });
    return newCore;
  };

  render() {
    const { currentWorker } = this.state;
    const { workerList } = this.props.weekStore;
    const weekly = this.filterWeekly();
    if (!weekly) {
      return null;
    }
    const core = currentWorker ? this.filterCore(weekly[0]) : weekly[0];
    const problem = weekly[1];
    const detail = weekly[2];
    const next = weekly[3];
    return (
      <div className="view-container">
        <Link id="showKey" className="save-btn on" to="/edit">去编辑</Link>
        <div className="worker-box">
          {
            Object.values(workerList).map((item) => {
              return (
                <span
                  key={item.value}
                  className={`worker ${this.state.currentWorker === item.value ? 'checked' : ''}`}
                  onClick={() => {
                    this.onChangeWorker(item.value)
                  }}
                >@{item.label}
              </span>
              )
            })
          }
        </div>
        <div className="core">
          <div className="title paragraph">核心工作要点:</div>

          {
            Object.entries(core).map((project, index) => {
              return this.getProject({ project: project, showWorker: false, isCore: true });
            })
          }
        </div>
        <div className="problem">
          <div className="title paragraph">本周问题/故障：</div>
          {
            problem[0] && problem[0].map((item, index) => {
              return this.getItem({ item, index });
            })
          }
          {
            problem[0] && problem[0].length === 0 &&
            <div className="item paragraph">1. 无；</div>
          }
          <div className="item paragraph"><br /></div>
        </div>
        <div className="detail">
          <div className="title paragraph">详细进展：</div>
          <div>
            {
              Object.entries(detail).map((project, index) => {
                return this.getProject({ project, index, showWorker: true });
              })
            }
          </div>
        </div>
        <div className="next">
          <div className="title paragraph">下周计划：</div>
          {
            next[0] && next[0].map((item, index) => {
              return this.getItem({ item, index, showWorker: true });
            })
          }
        </div>
      </div>
    );
  }
}

export default hot(module)(Home);
