import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import './fonts/iconfont';
import './fonts/iconfont.css';
import stores from './stores';
import './less/style.less';
import Routes from './routes';
import 'react-select/dist/react-select.css';

const AV = require('leancloud-storage');
window.AV = AV;
const APP_ID = 'zlkVlC3SYCJ7sowbyHaV7u67-gzGzoHsz';
const APP_KEY = '2hsexWyAIMl6qOCMD3xPP5co';

AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});

ReactDOM.render(
  <Provider {...stores}>
    {Routes}
  </Provider>,
  document.getElementById('root')
);
