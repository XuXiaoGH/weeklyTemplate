import workType from './projectList';


export default {
  // 核心工作要点
  0: [
    {
      ...workType.balance,
      list: [
        {
          text: "国际站个人KYC新老mobx store合并，统一数据源优化国际站个人KYC新老mobx store合并，统一数据源优化",
          status: 1,
          date: "5.15",
          worker: [1, 2],
        }, {
          text: "账户和安全页面优化需求",
          status: 2,
          date: "预计下周一提测",
          worker: [1, 2],
        }, {
          text: "充币自动划转至指定交易账户需求，开发完成待联调，预计22日提测",
          status: "5",
          date: "",
          worker: [],
        }
      ]
    },
    {
      ...workType.account,
      list: [
        {
          text: "国际站个人KYC新老mobx store合并，统一数据源优化",
          status: 3,
          date: "5.15",
          worker: [1, 2],
        }, {
          text: "账户和安全页面优化需求",
          status: 4,
          date: "预计下周一提测",
          worker: [1, 2],
        }, {
          text: "充币自动划转至指定交易账户需求，开发完成待联调，预计22日提测",
          status: 5,
          date: "",
          worker: [],
        }
      ]
    },
    {
      ...workType.broker,
      list: []
    },
    {
      ...workType.pool,
      list: []
    },
    {
      ...workType.oklink,
      list: []
    },
    {
      ...workType.okjp,
      list: [
        {
          text: "国际站个人KYC新老mobx store合并，统一数据源优化",
          status: 6,
          date: "5.15",
          worker: [1, 2],
        }, {
          text: "账户和安全页面优化需求",
          status: 7,
          date: "预计下周一提测",
          worker: [1, 2],
        }, {
          text: "充币自动划转至指定交易账户需求，开发完成待联调，预计22日提测",
          status: 8,
          date: "",
          worker: [],
        }
      ]
    },
    {
      ...workType.activity,
      list: []
    },
    {
      ...workType.okex,
      list: []
    },
    {
      ...workType.okcoin,
      list: []
    }
  ],
  // 问题故障
  1: [
    {
      text: "国际站个人KYC新老mobx store合并，统一数据源优化",
      status: 1,
      date: "5.15",
      worker: [1, 2],
    },
  ],
  // 详细进展
  2: [
    {
      ...workType.balance,
      list: []
    },
    {
      ...workType.account,
      list: []
    },
    {
      ...workType.pool,
      list: []
    },
    {
      ...workType.oklink,
      list: []
    },
    {
      ...workType.balance,
      list: []
    },
    {
      ...workType.okex,
      list: []
    },
    {
      ...workType.okcoin,
      list: []
    }
  ],
  // 下周计划
  3: []
}
