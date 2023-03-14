import './ads-css/adsSection.css';
import './ads-css/arround-block.css';
import Siema from 'siema';
import adsTemplate from './templates/block__list/adsTemplate.hbs';
import adsTemplateArround from './templates/arround-block__list/arround-block__list.hbs';
import throttle from 'lodash.throttle';
// =====================images==============================
import airPods from '../../assets/images/OLXProject/air_pods_pro-min.png';
import appleWatch from '../../assets/images/OLXProject/apple_watch-min.png';
import dzinsy from '../../assets/images/OLXProject/dzinsy-min.png';
import ganteli from '../../assets/images/OLXProject/ganteli-min.png';
import gear from '../../assets/images/OLXProject/gear-min.png';
import hot from '../../assets/images/OLXProject/hot-min.png';
import fen from '../../assets/images/OLXProject/hotpng.com-min.png';
import iphone from '../../assets/images/OLXProject/iphoneX-min.png';
import JBL from '../../assets/images/OLXProject/JBL-min.png';
import playstation from '../../assets/images/OLXProject/playstation-4-min.png';
import shkaf from '../../assets/images/OLXProject/shkaf-min.png';
import water from '../../assets/images/OLXProject/water-min.png';
import Glider from 'glider-js';
// =========================================================
const blockList = document.querySelector('.block__list');
const arroundBlockList = document.querySelector('.arround-block__list');
const horizontalBlock = document.querySelector('.horizontal-block');
// =========================================================
const newItem = [
  { image: airPods, name: 'AirPods Pro', price: 8000 },
  { image: appleWatch, name: 'Apple Watch', price: 12000 },
  { image: dzinsy, name: 'Jeans Lee', price: 1999 },
  { image: ganteli, name: 'Dumbbels 2kg', price: 500 },
  { image: gear, name: 'Continental', price: 10000 },
  { image: hot, name: 'Tefal', price: 1299 },
];
// =========================================================
const arroundItem = [
  { image: fen, name: 'Hairdryer Philips', price: 999 },
  { image: iphone, name: 'IphoneX', price: 15999 },
  { image: JBL, name: 'JBL speaker', price: 5799 },
  { image: playstation, name: 'Playstation', price: 8999 },
  { image: shkaf, name: 'Closet', price: 3599 },
  { image: water, name: 'Washbasin', price: 1199 },
];
// =========================================================

const renderAds = () => {
  if (window.matchMedia('(max-width: 767px)').matches) {
    blockList.innerHTML = newItem.map(item => adsTemplate(item)).join('');
    const glider = new Glider(blockList, {
      slidesToShow: 1,
      draggable: true,
    });
    setInterval(() => {
      glider.scrollItem(glider.page + 1);
    }, 3500);
    arroundBlockList.innerHTML = '';
    horizontalBlock.innerHTML = '';
  } else if (
    window.matchMedia('(min-width: 768px)' && '(max-width: 1279px)').matches
  ) {
    blockList.innerHTML = newItem.map(item => adsTemplate(item)).join('');
    const glider = new Glider(blockList, {
      slidesToShow: 1,
      draggable: true,
    });
    setInterval(() => {
      glider.scrollItem(glider.page + 1);
    }, 3500);
    arroundBlockList.innerHTML = arroundItem
      .map(item => adsTemplateArround(item))
      .slice(0, 2)
      .join('');
    horizontalBlock.innerHTML = '';
  } else {
    blockList.innerHTML = newItem.map(item => adsTemplate(item)).join('');
    const glider = new Glider(blockList, {
      slidesToShow: 1,
      draggable: true,
    });
    setInterval(() => {
      glider.scrollItem(glider.page + 1);
    }, 3500);
    arroundBlockList.innerHTML = arroundItem
      .map(item => adsTemplateArround(item))
      .slice(0, 2)
      .join('');
    horizontalBlock.innerHTML = arroundItem
      .map(item => adsTemplateArround(item))
      .slice(3, 6)
      .join('');
  }
};
window.addEventListener('resize', throttle(renderAds, 500));
renderAds();
