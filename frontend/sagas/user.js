import { all, fork, take, takeLatest, call, put } from 'redux-saga/effects';
import { LOG_IN, LOG_IN_SUCCESS, LOG_IN_FAILURE } from "../reducers/user";

function loginAPI() {
    // 서버에 요청을 보내는 부분
}

function* login() {
    try {
        yield call(loginAPI); // 함수 동기적 호출
        yield put({ // put은 dispatch와 동일
            type: LOG_IN_SUCCESS,
        });
    } catch (e) {
        console.error(e);
        yield put({
            type: LOG_IN_FAILURE,
        });
    }
}

function* watchLogin() {
    // 로그인 액션이 실행되면 중단점이 풀리고 로그인 성공 액션을 실행한다
    yield take(LOG_IN);
    put({
        type: LOG_IN_SUCCESS,
    });
}

export default function* userSaga() {
    yield all([
        watchLogin(), // 함수 비동기적 호출
    ]);
};