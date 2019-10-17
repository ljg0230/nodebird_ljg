import {
  all,
  fork,
  takeEvery,
  call,
  put
} from "redux-saga/effects";
import {
  LOG_IN_SUCCESS,
  LOG_IN_FAILURE,
  LOG_IN_REQUEST,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAILURE,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
  SIGN_UP_FAILURE,
  LOG_OUT_REQUEST,
  LOG_OUT_SUCCESS,
  LOG_OUT_FAILURE,
} from "../reducers/user";
import axios from "axios";



//#region api/watch/watch동작 이 세개의 함수가 하나의 사이클(패턴)을 이루게끔 만들자
function logInAPI(loginData) {
  // 서버에 요청을 보내는 부분
  return axios.post("/user/login", loginData, {
    //
    withCredentials: true // 쿠키를 주고 받는다
  });
}

function* logIn(action) {
  try {
    const result = yield call(logInAPI, action.data); // 함수 동기적 호출
    yield put({
      // put은 dispatch와 동일
      type: LOG_IN_SUCCESS,
      data: result.data
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOG_IN_FAILURE
    });
  }
}

function* watchLogIn() {
  // 로그인 액션이 실행되면 중단점이 풀리고 로그인 성공 액션을 실행한다
  yield takeEvery(LOG_IN_REQUEST, logIn);
}
//#endregion

function signUpAPI(signUpData) {
  // 서버에 요청을 보내는 부분
  return axios.post("/user/", signUpData);
}

function* signUp(action) {
  try {
    yield call(signUpAPI, action.data); // signUpAPI 에 action.data 인자를 넣어준다
    yield put({
      // put은 dispatch와 동일
      type: SIGN_UP_SUCCESS
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: SIGN_UP_FAILURE,
      error: e
    });
  }
}

function* watchSignUp() {
  yield takeEvery(SIGN_UP_REQUEST, signUp);
}

function logOutAPI() {
  // 서버에 요청을 보내는 부분
  return axios.post(
    "/user/logout",
    {},
    {
      withCredentials: true
    }
  ); // logout은 데이터(2번째 인자)가 필요없다. 이미 받은 쿠키를 이용한다
}

function* logOut() {
  try {
    yield call(logOutAPI); //
    yield put({
      type: LOG_OUT_SUCCESS
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOG_OUT_FAILURE,
      error: e
    });
  }
}

function* watchLogOut() {
  yield takeEvery(LOG_OUT_REQUEST, logOut);
}

function loadUserAPI() {
  return axios.get("/user/", {  // get은 데이터를 받지 않으므로 2번째 인자에 바로 설정 인자
    withCredentials: true,
  });
}

function* loadUser() {
  try {
    const result = yield call(loadUserAPI); // 함수 동기적 호출
    yield put({
      // put은 dispatch와 동일
      type: LOAD_USER_SUCCESS,
      data: result.data, // action.data 로 들어감
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_USER_FAILURE,
      error: e,
    });
  }
}

function* watchLoadUser() {
  // 로그인 액션이 실행되면 중단점이 풀리고 로그인 성공 액션을 실행한다
  yield takeEvery(LOAD_USER_REQUEST, loadUser);
}

export default function* userSaga() {
  yield all([
    fork(watchLogIn), // 함수 비동기적 호출
    fork(watchLogOut),
    fork(watchLoadUser),
    fork(watchSignUp),
  ]);
}
