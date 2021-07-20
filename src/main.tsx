/*
 * @Author: Mwing
 * @since: 2021-06-30 11:48:47
 * @lastTime: 2021-07-15 14:39:52
 * @LastAuthor: Mwing
 * @message:
 * @FilePath: \scrm-activity\fe-scaffold\src\main.tsx
 */
/* @refresh reset */
import React from 'react';
import ReactDOM from 'react-dom';
import './main.less';
import './main.response.less';
import Main from './App';
ReactDOM.render(<Main />, document.getElementById('root'));
// @ts-ignore
if (process.env.BUILD_ENV === 'development' && module.hot) {
	// @ts-ignore
	module.hot.accept('./main', () => {
		// 重新渲染到 document 里面
		ReactDOM.render(<Main />, document.getElementById('root'));
	});
}
