import styles from './button.module.scss';

const $button = (text: string, type: 'submit' | 'button' | 'reset') => {
  const view = `
    <button class=${styles.button} type=${type}>${text}</button>
  `;

  return view;
};

export default $button;
