import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import './fonts/iconfont';
import './fonts/iconfont.css';
import stores from './stores';
import './less/style.less';
import Routes from './routes';
import 'react-select/dist/react-select.css';

ReactDOM.render(
  <Provider {...stores}>
    {Routes}
  </Provider>,
  document.getElementById('root')
);
