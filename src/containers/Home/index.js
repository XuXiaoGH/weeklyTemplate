import React from 'react';
import { inject, observer } from 'mobx-react';
import { hot } from 'react-hot-loader';
import './index.less';

import UTIL from '../../utils/util';
import template from '../../source/template';
import statusList from '../../source/statusList';
import workerList from '../../source/workerList';

@inject('weekStore')
@observer
class Home extends React.Component {

  constructor() {
    super();
    this.state = {
      currentWorker: null,
    }
  }

  // 渲染项目
  getProject = ({ project, index, showWorker, isCore }) => {
    if (!project.list || project.list.length === 0) {
      return null;
    }
    const { currentWorker } = this.state;
    return (
      <div className="project" key={index}>
        {!(currentWorker && isCore) && <div className="project-title paragraph">{project.label}：</div>}
        {
          project.list && project.list.map((item, index) => {
            return this.getItem({ item, index, showWorker });
          })
        }
        <div className="item paragraph"><br /></div>
      </div>
    );
  };

  // 渲染每一个条目
  getItem = ({ item, index, showWorker }) => {
    const { currentWorker } = this.state;
    let show = showWorker && !currentWorker;
    return (
      <div className="item paragraph" key={index}>
        <span className="index">{index + 1}. </span>
        <span className="text">{item.text}</span>
        {
          item.status && <span className="text">，{statusList[Number(item.status)].label}</span>
        }
        {
          String(item.date).trim() && <span className="text">（{item.date}）</span>
        }
        {
          show && item.worker && item.worker.length !== 0 &&
          <span className="worker">
          {
            item.worker.map((worker, i) => {
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
    const weekly = JSON.parse(localStorage.getItem('weekly'));
    if (!weekly) {
      return null;
    }
    const { currentWorker } = this.state;
    if (!currentWorker) {
      return weekly;
    }
    return Object.values(weekly).map((part) => {
      // 遍历部分
      return part.map((project) => {
        const newProject = UTIL.deepCopy(project);
        newProject.list = [];
        // 遍历项目
        project.list.forEach((item) => {

          if (item.worker.includes(currentWorker)) {
            newProject.list.push(item);
          }
        });
        return newProject;
      })
    });
  };

  filterCore = (core) => {
    const newCore = [{ list: [] }];
    core.forEach((project) => {
      project.list.forEach((item) => {
        newCore[0].list.push(item);
      });
    });
    return newCore;
  };

  render() {
    const { currentWorker } = this.state;
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
            core.map((project, index) => {
              return this.getProject({ project, index, showWorker: false, isCore: true });
            })
          }
        </div>
        <div className="problem">
          <div className="title paragraph">本周问题/故障：</div>
          {
            problem[0].list.map((item, index) => {
              return this.getItem({ item, index });
            })
          }
          {
            problem[0].list.length === 0 &&
            <div className="item paragraph">1. 无；</div>
          }
          <div className="item paragraph"><br /></div>
        </div>
        <div className="detail">
          <div className="title paragraph">详细进展：</div>
          <div>
            {
              detail.map((project, index) => {
                return this.getProject({ project, index, showWorker: true });
              })
            }
          </div>
        </div>
        <div className="next">
          <div className="title paragraph">下周计划：</div>
          {
            next[0].list.map((item, index) => {
              return this.getItem({ item, index, showWorker: true });
            })
          }
        </div>
      </div>
    );
  }
}

export default hot(module)(Home);
