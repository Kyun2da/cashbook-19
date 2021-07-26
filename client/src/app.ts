import $button from './components/button/button';
import $icon from './components/icon/icon';
import './style.scss';

const $body = document.querySelector('body');

const $title = document.createElement('h1');

$title.innerText = 'title';

const button = document.createElement('button');
button.innerText = 'module test';

$body.appendChild($title);
$body.innerHTML += $button('click', 'button');
$body.innerHTML += $icon('icon', 'CHECK');
$body.innerHTML += $icon('icon', 'CHECK_MINT');
$body.appendChild(button);
