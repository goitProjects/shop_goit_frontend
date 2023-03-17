import axios from 'axios';
import { updateUserAvatar } from '../../services/user-api';

const mainUrl = 'https://callboard-backend-en.goit.global';

export function avatarManipulation() {
  const fileInput = document.querySelector('.user-avatar__file-input');
  const clearAvatarBtn = document.querySelector('.user-avatar__clear-btn');

  fileInput.addEventListener('change', hendleChange);
  clearAvatarBtn.addEventListener('click', resetForDefault);
}

const validateAvatar = file => {
  const isAcceptableFormat =
    file.type === 'image/png' ||
    file.type === 'image/jpeg' ||
    file.type === 'image/jpg';
  const fileSize = file.size / 1024 / 1024;
  const isAcceptableSize = fileSize < 0.5;
  return isAcceptableFormat && isAcceptableSize;
};

function hendleChange(e) {
  const file = e.target.files[0];
  if (!validateAvatar(file)) {
    alert(
      'Avatar picture has to be less than 0.5mb size and *png, *jpg, *jpeg format.'
    );
    return;
  }
  const reader = new FileReader();
  const formData = new FormData();
  formData.append('file', file);
  const imgSearche = document.querySelectorAll('.avatar');
  reader.onloadend = async () => {
    imgSearche.forEach(img => (img.src = reader.result));
    await axios({
      method: 'PATCH',
      url: `${mainUrl}/user/avatar`,
      data: formData,
      headers: {
        Authorization: JSON.parse(localStorage.getItem('user-info')).token,
      },
    }).catch(err => {
      alert('Something went wrong with avatar upload. Please try again later.');
      resetForDefault();
    });

    // const localUserObj = JSON.parse(localStorage.getItem('user-info'));
    // updateUserAvatar(localUserObj.userId, reader.result, localUserObj.token);
  };
  file ? reader.readAsDataURL(file) : resetForDefault();
}

async function resetForDefault() {
  const srcDefault = 'https://i.ibb.co/K7j3rZk/99-512.png';
  await axios({
    method: 'PATCH',
    url: `${mainUrl}/user/default-avatar`,
    headers: {
      Authorization: JSON.parse(localStorage.getItem('user-info')).token,
    },
  });
  document.querySelectorAll('.avatar').forEach(img => (img.src = srcDefault));
  const localUserObj = JSON.parse(localStorage.getItem('user-info'));
  // updateUserAvatar(localUserObj.userId, srcDefault, localUserObj.token);
}
