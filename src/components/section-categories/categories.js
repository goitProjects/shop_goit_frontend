import './categories-styles/category.css';
import './categories-styles/more-info.css';
import catMain from './categories-templates/category-main.hbs';
import catPop from './categories-templates/category-item.hbs';
import { load, ready } from '../loader/loader';
import { api } from '../services/api';
import { showItemModal } from '../item-modal/item-modal-open';
import throttle from 'lodash.throttle';
import data from '../services/data';
import Glider from 'glider-js';
// =========================================================
const blockList = document.querySelector('.block__list');
const arroundBlockList = document.querySelector('.arround-block__list');
const horizontalBlock = document.querySelector('.horizontal-block');
// =========================================================
const categories = document.querySelector('.categories .container');
const btnLoadMore = document.querySelector('.load-more');
let counterStartIdx = 0;
let counterEndIdx = 2;
const nameAllCategories = [
  'electronics',
  'property',
  'transport',
  'work',
  'businessAndServices',
  'recreationAndSport',
  'free',
  'trade',
];
load();
function fnSwitch(startIdx, endIdx) {
  nameAllCategories.slice(startIdx, endIdx).forEach((word, idx, curArr) => {
    if (counterStartIdx < nameAllCategories.length + 1) {
      counterStartIdx += 1;
    }

    if (curArr.length < 2 || counterEndIdx !== 3) {
      counterEndIdx += 1;
    }
    return test(word);
  });
}

export function test(word) {
  return api.getCategory(word).then(data => {
    if (document.querySelector('.loader-wrapper')) {
      ready();
      blockList.classList.add('block__list-show');
      arroundBlockList.classList.add('arround-block__list-show');
      horizontalBlock.classList.add('horizontal-block-show');
    }
    switch (word) {
      case 'property':
        data[0].nameCategory = 'Property';
        data[0].descriptionCategory = 'Wide variety of flats and houses';
        break;
      case 'transport':
        data[0].nameCategory = 'Transport';
        data[0].descriptionCategory =
          'In this section, you can find any vehicle of your choice';
        break;
      case 'work':
        data[0].nameCategory = 'Work';
        data[0].descriptionCategory =
          'If you are looking for a job then come to us. More than 500 vacancies every day';
        break;
      case 'electronics':
        data[0].nameCategory = 'Electronics';
        data[0].descriptionCategory =
          "Any electronics from children's toys to refrigerators";
        break;
      case 'businessAndServices':
        data[0].nameCategory = 'Business and services';
        data[0].descriptionCategory =
          'Need help promoting small business? Hurry up, come exactly to us';
        break;
      case 'recreationAndSport':
        data[0].nameCategory = 'Recreation and sport';
        data[0].descriptionCategory =
          'Looking for a place to hide from the hustle and bustle and everyday life. We will show you the place you dreamed of';
        break;
      case 'free':
        data[0].nameCategory = 'Free';
        data[0].descriptionCategory =
          "Take me away. I'm going to be taken soon!";
        break;
      case 'trade':
        data[0].nameCategory = 'Trade';
        data[0].descriptionCategory =
          'You want a new thing, but there is no money. Who seeks will always find';
        break;
      default:
        break;
    }
    let category = data[0].category;
    categories.insertAdjacentHTML('beforeend', catMain(data[0]));
    let list = document.querySelector(`.${category}-list`);
    list.insertAdjacentHTML('beforeend', catPop(data));
    const slidePrev = document.querySelector(
      `.${category}-wrapper .slide-prev`
    );
    const slideNext = document.querySelector(
      `.${category}-wrapper .slide-next`
    );
    // ===================================================
    const createGlider = () => {
      const glider = new Glider(list, {
        slidesToShow: 1,
        draggable: true,
        arrows: {
          prev: slidePrev,
          next: slideNext,
        },
        responsive: [
          {
            // screens greater than >= 775px
            breakpoint: 767,
            draggable: false,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
              itemWidth: 150,
              duration: 0.25,
            },
          },
          {
            // screens greater than >= 1024px
            breakpoint: 1279,
            draggable: false,
            settings: {
              slidesToShow: 4,
              slidesToScroll: 1,
              itemWidth: 150,
              duration: 0.25,
            },
          },
        ],
      });
    };
    createGlider();

    const ulX = document.querySelector(`.${word}-list`);
    showItemModal(ulX);
    btnLoadMore.classList.remove('hide');
    btnLoadMore.addEventListener('click', showMoreCategories);
    if (counterStartIdx === nameAllCategories.length) {
      btnLoadMore.classList.add('hide');
    }
  });
}
fnSwitch(counterStartIdx, counterEndIdx);

function showMoreCategories(e) {
  if (counterStartIdx > nameAllCategories.length) {
    return;
  }
  fnSwitch(counterStartIdx, counterEndIdx);
}
