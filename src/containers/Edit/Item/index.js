import React from 'react';
import Icon from '@ok/IconLite';
import Message from '@ok/Message';
import Select from 'react-select';
import RootContext from '../../RootContext';


const SORT_STEP = 100;

export default class Item extends RootContext {
  // 保存或更新条目
  saveItem = (props) => {
    const {
      item, itemIndex, projectId, partId, newSort
    } = props;
    const {
      weekSign, date, text, status, worker, id, sort
    } = item;
    let weekly = {};
    if (id) {
      weekly = window.AV.Object.createWithoutData('weekly', id);
    } else {
      const Weekly = window.AV.Object.extend('weekly');
      // 新建对象
      weekly = new Weekly();
    }
    weekly.set('weekSign', weekSign || this.weekSign);
    weekly.set('part', Number(partId));
    weekly.set('project', Number(projectId));
    weekly.set('sort', newSort || sort || itemIndex * SORT_STEP);
    weekly.set('date', date);
    weekly.set('text', text);
    weekly.set('status', String(status));
    weekly.set('worker', worker);

    weekly.save().then((res) => {
      this.props.refresh();
      Message.success({ content: '保存成功' });
    }, (error) => {
      Message.error({ content: '保存失败' });
    });
  };

  upItem = (props) => {
    const {
      project, item, itemIndex, projectId, partId
    } = props;
    const lastSort = project[itemIndex - 1].sort;
    const last2Sort = project[itemIndex - 2] ? project[itemIndex - 2].sort : lastSort - 2 * SORT_STEP;
    this.saveItem(Object.assign(props, { newSort: lastSort - (lastSort - last2Sort) / 2 }));
  };
  downItem = (props) => {
    const {
      project, item, itemIndex, projectId, partId
    } = props;
    const nextSort = project[itemIndex + 1].sort;
    const next2Sort = project[itemIndex + 2] ? project[itemIndex + 2].sort : nextSort + 2 * SORT_STEP;

    this.saveItem(Object.assign(props, { newSort: nextSort + (next2Sort - nextSort) / 2 }));
  };

  render() {
    const {
      project, item, itemIndex, projectId, partId, statusList, workerList
    } = this.props;
    return (
      <div className="item paragraph" key={`${partId}${projectId}${itemIndex}`}>
        <span
          className="del-btn"
          onClick={() => {
            this.props.delItem({
              item, projectId, partId, itemIndex
            });
          }}
        >-
        </span>
        <div className="input-area">
          <textarea
            className="input"
            value={item.text}
            data-part-index={partId}
            data-project-index={projectId}
            data-item-index={itemIndex}
            placeholder="工作描述：用简练的语言让一个不知道的人听明白"
            onChange={(e) => {
              this.props.updateText({
                item,
                itemIndex,
                projectId,
                partId,
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
            placeholder="状态"
            onChange={(newValue) => {
              this.props.updateStatus({
                item, itemIndex, projectId, partId, newValue
              });
            }}
          />
          <Select
            className="select-time"
            value={item.date}
            searchable={false}
            clearable={false}
            options={this.dateList}
            placeholder="时间"
            onChange={(newValue) => {
              this.props.updateWeek({
                item, itemIndex, projectId, partId, newValue
              });
            }}
          />
          {
            <span className="worker">
              {
                Object.values(workerList).map((worker, i) => {
                  const checkId = `checkbox${partId}${projectId}${itemIndex}${worker.value}`;
                  const checked = item.worker.includes(worker.value);
                  return (
                    <span className="check" key={checkId}>
                    <input
                      type="checkbox"
                      className="checkbox"
                      id={checkId}
                      checked={checked}
                      onChange={(e) => {
                        this.props.updateWorker({
                          item,
                          itemIndex,
                          projectId,
                          partId,
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

        <span onClick={() => {
          this.saveItem({
            item, itemIndex, projectId, partId
          });
        }}
        >
          <Icon className="iconsave save-item-btn" />
        </span>

        <span
          className={`sort-btn ${itemIndex === 0 ? 'disabled' : ''}`}
          onClick={() => {
            this.upItem({
              project, item, projectId, partId, itemIndex
            });
          }}
        >↑
        </span>
        <span
          className={`sort-btn ${itemIndex === project.length - 1 ? 'disabled' : ''}`}
          onClick={() => {
            this.downItem({
              project, item, projectId, partId, itemIndex
            });
          }}
        >↓
        </span>
      </div>
    );
  }
}
