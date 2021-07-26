import '@/core/styles/reset.css';
import '@/core/styles/global.scss';

import List from '@/views/list';
import Form from '@/views/form';
import Count from '@/views/count';
import State from './lib/state';
import users from './core/utils/users';

// Instantiate classes.
const AppState = new State(); // 어플리케이션 상태
const namesList = new List(); // 새로운 유저 리스트를 만든다.
const userForm = new Form(AppState); // 새로운 유저 폼을 만든다.
const userCount = new Count(); // 새로운 유저 카운트를 만든다.

// 초기 유저 상태를 업데이트
AppState.update({ users });

// 옵저버를 추가한다. 이 오브젝트는 상태가 변경될 때마다 리렌더링 될 것이다.
AppState.subscribe(namesList);
AppState.subscribe(userCount);

// 로드되면
namesList.render(AppState.get(), 'user-list-container');
userForm.render('#add-user-container');
userCount.render(AppState.get(), 'user-count-container');
