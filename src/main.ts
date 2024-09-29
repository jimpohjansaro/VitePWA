import {fetchData} from './functions';
import {UpdateResult} from './interfaces/UpdateResult';
import {UploadResult} from './interfaces/UploadResult';
import {LoginUser, UpdateUser, User} from './interfaces/User';
import {apiUrl, uploadUrl} from './variables';

// PWA code

// select forms from the DOM
const loginForm = document.querySelector('#login-form');
const profileForm = document.querySelector('#profile-form');
const avatarForm = document.querySelector(
  '#avatar-form'
) as HTMLFormElement | null;

// select inputs from the DOM
const usernameInput = document.querySelector(
  '#username'
) as HTMLInputElement | null;
const passwordInput = document.querySelector(
  '#password'
) as HTMLInputElement | null;

const profileUsernameInput = document.querySelector(
  '#profile-username'
) as HTMLInputElement | null;
const profileEmailInput = document.querySelector(
  '#profile-email'
) as HTMLInputElement | null;

const avatarInput = document.querySelector(
  '#avatar'
) as HTMLInputElement | null;

// select profile elements from the DOM
const usernameTarget = document.querySelector(
  '#username-target'
) as HTMLSpanElement | null;
const emailTarget = document.querySelector(
  '#email-target'
) as HTMLSpanElement | null;
const avatarTarget = document.querySelector(
  '#avatar-target'
) as HTMLImageElement | null;

// function to login
const login = async (): Promise<LoginUser | null> => {
  if (!passwordInput || !usernameInput) {
    throw new Error('ei elementtejä');
  }
  const password = passwordInput.value;
  const username = usernameInput.value;

  const data = {
    username: username,
    password: password,
  };

  const options: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  const result = await fetchData<LoginUser>(apiUrl + '/auth/login', options);
  return result;
};

// TODO: function to update user data
const updateUserData = async (
  user: UpdateUser,
  token: string
): Promise<UpdateResult> => {};

// TODO: function to add userdata (email, username and avatar image) to the
// Profile DOM and Edit Profile Form
const addUserDataToDom = (user: User): void => {
  if (!emailTarget || !usernameTarget || !avatarTarget) {
    return;
  }

  emailTarget.innerHTML = user.email;
  usernameTarget.innerHTML = user.username;
  avatarTarget.src = uploadUrl + user.avatar;
};

// function to get userdata from API using token
const getUserData = async (token: string): Promise<User> => {};

// TODO: function to check local storage for token and if it exists fetch
// userdata with getUserData then update the DOM with addUserDataToDom
const checkToken = async (): Promise<void> => {};

// call checkToken on page load to check if token exists and update the DOM
checkToken();

// TODO: login form event listener
// event listener should call login function and save token to local storage
// then call addUserDataToDom to update the DOM with the user data
loginForm &&
  loginForm.addEventListener('submit', async (evt) => {
    try {
      evt.preventDefault();
      const loginResult = await login();
      if (loginResult) {
        console.log(loginResult);
        localStorage.setItem('token', loginResult.token);
        addUserDataToDom(loginResult.data);
      }
    } catch (error) {
      console.log((error as Error).message);
    }
  });

// TODO: profile form event listener
// event listener should call updateUserData function and update the DOM with
// the user data by calling addUserDataToDom or checkToken

// TODO: avatar form event listener

// event listener should call uploadAvatar function and update the DOM with
// the user data by calling addUserDataToDom or checkToken
if (avatarForm) {
  avatarForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const fd = new FormData(avatarForm);
    const token = localStorage.getItem('token');
    const options: RequestInit = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
      },
      body: fd,
    };
    const UploadResult = await fetchData<UploadResult>(
      apiUrl + '/users/avatar',
      options
    );

    console.log(UploadResult);
  });
}
