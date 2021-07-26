import CHECK from '../../images/check.svg';
import CHECK_MINT from '../../images/check-mint.svg';

const assets = {
  CHECK,
  CHECK_MINT,
};

export type ICON_NAMES = keyof typeof assets;

const $icon = (classname: string, src: ICON_NAMES) => {
  const view = `<img src="${assets[src]}" alt="${src} ICON" class="icon ${classname}" />`;
  return view;
};

export default $icon;
