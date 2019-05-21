import React from 'react';
import { inject, observer } from 'mobx-react';
import { hot } from 'react-hot-loader';
import './index.less';

import UTIL from '../../utils/util';
import template from '../../source/template';
import statusList from '../../source/statusList';
import workerList from '../../source/workerList';

const temp = UTIL.deepCopy(template);

@inject('demoStore')
@observer
class Home extends React.Component {

  // 渲染项目
  getProject = (project, index) => {
    if (!project.list || project.list.length === 0) {
      return null;
    }
    return (
      <div className="project" key={index}>
        <div className="project-title paragraph">{project.label}</div>
        {
          project.list && project.list.map((item, index) => {
            return this.getItem(item, index);
          })
        }
        <div className="item paragraph"><br /></div>
      </div>
    );
  };

  // 渲染每一个条目
  getItem = (item, index) => {
    return (
      <div className="item paragraph" key={index}>
        <span className="index">{index + 1}. </span>
        <span className="text">{item.text}</span>
        {
          item.status && <span className="text">，{statusList[Number(item.status)].label}</span>
        }
        {
          item.date && <span className="text">（{item.date}）</span>
        }
        {
          item.worker && item.worker.length !== 0 &&
          <span className="worker">
          {
            item.worker.map((worker,i) => {
              return (
                <span className="worker" key={i}> @{workerList[worker].label}</span>
              );
            })
          }
        </span>
        }
        ；
      </div>);
  };

  render() {
    return (
      <div>
        <div className="core">
          <div className="title paragraph">核心工作要点:</div>
          {
            template[0].map((project, i) => {
              return this.getProject(project, i);
            })
          }
        </div>
        <div className="problem">
          <div className="title paragraph">本周问题/故障：</div>
          {
            template[1] && template[1].length !== 0 && template[1].map((item, index) => {
              return this.getItem(item, index);
            })
          }
          {
            template[1] && template[1].length !== 0 &&
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
