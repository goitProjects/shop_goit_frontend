import { blobToURL, urlToBlob, fromBlob, fromURL } from 'image-resize-compress';
import { api } from '../services/api';
import { modalBackDrop } from '../modal-window/logic-modal.js';
import markupModal from './templates/markup-adv-modal.hbs';
import '../modal-window/styles.css';
import './adv-styles.css';
import { murkupAuthForm } from '../auth-form/js/auth-form';
const refs = {
  button: document.querySelectorAll('.modal-btn'),
};

refs.button.forEach(item => item.addEventListener('click', createAdCheck));

function anonymousRegister() {
  murkupAuthForm('signin');
}

function createAdCheck() {
  if (localStorage.getItem('user-info')) {
    refs.button.forEach(item =>
      item.removeEventListener('click', anonymousRegister)
    );
    refs.button.forEach(item => item.addEventListener('click', createModal()));
  } else {
    refs.button.forEach(item => item.removeEventListener('click', createModal));
    refs.button.forEach(item =>
      item.addEventListener('click', anonymousRegister())
    );
  }
}

let imgLoaderArea;
let advForm;
let productImage;
let createData;

function createModal() {
  if (document.querySelector('.adv-modal')) {
    document.querySelector('.adv-modal').style.display = 'block';
  }
  if (document.querySelector('.modalContainer')) {
    document.querySelector('.modalContainer').style.display = 'block';
  }
  document.querySelector('body').style.overflow = 'hidden';
  const closeModal = modalBackDrop(markupModal());
  const closeBtn = document.querySelector('.adv-modal__close-btn');
  closeBtn.addEventListener('click', closeModal);

  imgLoaderArea = document.querySelector('.adv-modal__product-photos');
  advForm = document.forms.advForm;

  document
    .querySelector('.adv-modal__product-select')
    .addEventListener('change', event => {
      const productPriceWrap = document.querySelector('.input-wrapper__price');

      event.target.value === 'free'
        ? productPriceWrap.classList.add('hide-price')
        : productPriceWrap.classList.remove('hide-price');
      event.target.value === 'free'
        ? productPriceWrap.classList.remove('input-wrapper')
        : productPriceWrap.classList.add('input-wrapper');
    });

  advForm.addEventListener('submit', submitForm);
  imgLoaderArea.addEventListener('click', chooseImgBlock);
  imgLoaderArea.addEventListener('change', previewImg);
}
function saveData(event) {
  const userInfo = JSON.parse(localStorage.getItem('user-info'));
  const productName = event.currentTarget.elements.productName;
  const productDescription = event.currentTarget.elements.productDescription;
  const productPrice = event.currentTarget.elements.productPrice.value;

  const productCategory = event.currentTarget.elements.productCategory;
  createData = {
    author: userInfo.userId,
    name: productName.value,
    mainImg: '',
    image: [],
    category: productCategory.value === 'category' ? '' : productCategory.value,
    description: productDescription.value,
    ...(productCategory.value === 'free'
      ? {}
      : { price: Number(productPrice).toLocaleString() }),
  };
}

//==================================
function chooseImgBlock(event) {
  if (event.target === event.currentTarget) {
    return;
  }
  if (!event.target.dataset.active) {
    return;
  }
  const imgTarget = event.target;
  imgTarget.setAttribute('type', 'file');
}
//====================================

// ===================================
const handleBlob = async (blobFile, k = 100) => {
  const quality = k - 20;
  const width = 0;
  const height = 0;
  const format = '.jpg';

  try {
    if (blobFile?.size / 1024 / 1024 < 0.5) {
      return blobFile;
    }
    const blob = await fromBlob(blobFile, quality, width, height, format);
    if (blob.size / 1024 / 1024 > 0.2) {
      return await handleBlob(blobFile, quality);
    }
    return new File([blob], blobFile.name, { type: 'image/jpeg' });
  } catch (error) {
    throw new Error('Not allowed file size!\nMust be less then 3.5Mb');
  }
};
// ===================================
async function submitForm(event) {
  event.preventDefault();
  saveData(event);
  document.querySelector('.img-error').classList.add('hide');
  document.querySelector('.description-error').classList.add('hide');
  document.querySelector('.price-error').classList.add('hide');
  document.querySelector('.title-error').classList.add('hide');
  document.querySelector('.price-error-2').classList.add('hide');
  if (!document.querySelector('#fp1').files) {
    document.querySelector('.img-error').classList.remove('hide');
    return;
  }
  if (!document.querySelector('.adv-modal__product-name').value) {
    document.querySelector('.title-error').classList.remove('hide');
    return;
  }
  if (!document.querySelector('.adv-modal__product-description').value) {
    document.querySelector('.description-error').classList.remove('hide');
    return;
  }
  if (document.querySelector('.adv-modal__product-select').value !== 'free') {
    if (!document.querySelector('.adv-modal__product-price').value) {
      document.querySelector('.price-error').classList.remove('hide');
      return;
    }
  }
  if (document.querySelector('.adv-modal__product-price').value < 0) {
    document.querySelector('.price-error-2').classList.remove('hide');
    return;
  }
  const formDataEmpty = new FormData();
  formDataEmpty.set(
    'title',
    document.querySelector('.adv-modal__product-name').value
  );
  formDataEmpty.set(
    'description',
    document.querySelector('.adv-modal__product-description').value
  );
  formDataEmpty.set(
    'price',
    document.querySelector('.adv-modal__product-price').value
  );
  formDataEmpty.set(
    'category',
    document.querySelector('.adv-modal__product-select').value
  );
  let totalPhotosSize = 0;
  const addFileToForm = file => formDataEmpty.append('file', file);
  const formImgListLength = document.querySelector('#js-adv-modal-photos')
    .childNodes.length;
  try {
    const promises = await Array(formImgListLength)
      .fill(null)
      .map(async (_, i) => {
        const file =
          document.querySelector(`#fp${i + 1}`)?.files &&
          document.querySelector(`#fp${i + 1}`)?.files[0];
        if (file) {
          totalPhotosSize += file.size;
          const resizedFile = await handleBlob(file);
          addFileToForm(resizedFile);
        }
      })
      .filter(el => el);
    if (totalPhotosSize / 1024 / 1024 > 18.5) {
      throw new Error(
        'Not allowed files size!\n Every file must be less then 3.5Mb'
      );
    }
    await Promise.all(promises);
  } catch (error) {
    alert(error.message);
    return;
  }

  let allImg = event.target.querySelectorAll('img');
  allImg = Array.from(allImg);
  const allImgArr = allImg
    .filter(item => {
      const src = item.dataset.img;
      return src;
    })
    .map(item => item.src);
  createData.image = allImgArr;
  createData.mainImg = allImgArr[0];
  function clearImages(arr) {
    arr.map(item => (item.src = ''));
  }
  let allLabelArr = document.querySelectorAll('.input-label');
  allLabelArr = Array.from(allLabelArr);
  function returnMarkToStart(arr) {
    arr
      .filter(item => item.classList.contains('choose-this'))
      .map(item => item.classList.remove('choose-this'));
    allLabelArr[0].classList.add('choose-this');
  }
  let allPhotoInputs = document.querySelectorAll('.photo-input');
  allPhotoInputs = Array.from(allPhotoInputs);
  function removeInputFile(arr) {
    arr
      .filter(item => item.attributes.type)
      .map(item => item.removeAttribute('type'));
    arr
      .filter(item => item.dataset.active)
      .map(item => (item.dataset.active = ''));
    arr[0].dataset.active = true;
  }
  //===============================================
  api
    .postAdv(createData.category, formDataEmpty, allImgArr)
    .then(data => {
      const user = JSON.parse(localStorage.getItem('user-info'));
      const idAdv = data.id;
      localStorage.setItem(
        'user-info',
        JSON.stringify({
          ...user,
          adv: [...user.adv, idAdv],
        })
      );
    })
    .catch(err => {
      alert(
        `${err.message ?? 'Something went wrong, please try again later.'}`
      );
    });
  //===============================================
  advForm.reset();
  clearImages(allImg);
  returnMarkToStart(allLabelArr);
  removeInputFile(allPhotoInputs);
  const closeModal = modalBackDrop(markupModal());
  closeModal();
  // document.querySelector('.adv-modal').style.display = 'none';
  // document.querySelector('.modalContainer').style.display = 'none';
  // document.querySelector('body').style.overflow = 'unset';
}
//=================================

const validateImgFormat = file => {
  const isAcceptableFormat =
    file.type === 'image/png' ||
    file.type === 'image/jpeg' ||
    file.type === 'image/jpg';

  return isAcceptableFormat;
};
function previewImg(event) {
  if (event.target === event.currentTarget) {
    return;
  }
  const file = event.target.files[0];
  if (!validateImgFormat(file)) {
    alert('Picture has to be *png, *jpg, *jpeg format.');
    return;
  }
  changeImgBlock(event);
  if (event.target.dataset.id) {
    const inputID = event.target.dataset.id;
    const img = document.querySelector(`.input-label__img--${inputID}`);
    const reader = new FileReader();
    reader.onloadend = () => {
      img.src = reader.result;
      productImage = reader.result;
      img.setAttribute('data-img', productImage);
    };
    if (file) {
      reader.readAsDataURL(file);
    } else {
      img.src = '';
    }
  }
}
//======================
function changeImgBlock(event) {
  const imgTarget = event.target;
  imgTarget.nextElementSibling.classList.remove('choose-this');
  let imgId = Number(event.target.dataset.id);
  imgId += 1;
  if (imgId > 5) {
    return;
  }
  const nextImg = document.querySelector(`[data-id="${imgId}"]`);
  nextImg.dataset.active = true;
  nextImg.nextElementSibling.classList.add('choose-this');
}
