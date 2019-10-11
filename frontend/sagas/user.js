import {
  all,
  fork,
  takeEvery,
  takeLatest,
  call,
  put
} from "redux-saga/effects";
import {
  LOG_IN_SUCCESS,
  LOG_IN_FAILURE,
  LOG_IN_REQUEST,
  LOG_OUT_REQUEST,
  LOG_OUT_SUCCESS,
  LOG_OUT_FAILURE,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAILURE,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
  SIGN_UP_FAILURE
} from "../reducers/user";
import axios from "axios";



//#region api/watch/watch동작 이 세개의 함수가 하나의 사이클(패턴)을 이루게끔 만들자
function logInAPI(logInData) {
  // 서버에 요청을 보내는 부분
  return axios.post("/user/login", logInData, {
    withCredentials: true // 서로 쿠키를 주고 받을 수 있게 만든다
  });
}

function* logIn(action) {
  try {
    const result = yield call(logInAPI, action.data); // 함수 동기적 호출
    yield put({
      // put은 dispatch와 동일
      type: LOG_IN_SUCCESS,
      data: result.data // axios의 응답정보는 여기 들어있다
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

function logOutAPI() {
  // 로그아웃은 데이터를 보낼 필요가 없다
  return axios.post(
    "/user/logout",
    {},
    {
      withCredentials: true
    }
  ); //  '주소 / 데이터 / 설정' -> 인자값 순서 주의
}

function* logOut() {
  try {
    yield call(logOutAPI);
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
  // 서버에 요청을 보내는 부분
  return axios.get("/user/", {
    withCredentials: true
  }); // get은 데이터를 보내지 않는다 2번째 인자가 설정값
}

function* loadUser() {
  try {
    const result = yield call(loadUserAPI);
    yield put({
      // put은 dispatch와 동일
      type: LOAD_USER_SUCCESS,
      data: result.data
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_USER_FAILURE,
      error: e
    });
  }
}

function* watchLoadUser() {
  yield takeEvery(LOAD_USER_REQUEST, loadUser);
}

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

export default function* userSaga() {
  yield all([
    fork(watchLogIn), // 함수 비동기적 호출
    fork(watchLogOut),
    fork(watchLoadUser),
    fork(watchSignUp)
  ]);
}
