import { all, delay, fork, take, takeEvery, takeLatest, call, put } from "redux-saga/effects";
import { LOG_IN_SUCCESS, LOG_IN_FAILURE, LOG_IN_REQUEST, SIGN_UP_REQUEST, SIGN_UP_SUCCESS, SIGN_UP_FAILURE } from "../reducers/user";

//#region api/watch/watch동작 이 세개의 함수가 하나의 사이클(패턴)을 이루게끔 만들자
function loginAPI() {
  // 서버에 요청을 보내는 부분
}

function* login() {
  try {
    yield call(loginAPI); // 함수 동기적 호출
    yield put({
      // put은 dispatch와 동일
      type: LOG_IN_SUCCESS
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOG_IN_FAILURE
    });
  }
}

function* watchLogin() {
  // 로그인 액션이 실행되면 중단점이 풀리고 로그인 성공 액션을 실행한다
  yield takeEvery(LOG_IN_REQUEST, login)
}
//#endregion

function signUpAPI() {
  // 서버에 요청을 보내는 부분
}

function* signUp() {
  try {
    yield call(signUpAPI); // 함수 동기적 호출
    yield put({
      // put은 dispatch와 동일
      type: SIGN_UP_SUCCESS
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: SIGN_UP_FAILURE
    });
  }
}

function* watchSignUp() {
  yield takeEvery(SIGN_UP_REQUEST, signUp)
}

export default function* userSaga() {
  yield all([
    fork(watchLogin), // 함수 비동기적 호출
    fork(watchSignUp),
  ]);
}
