import {
  all,
  fork,
  put,
  delay,
  takeLatest,
  takeEvery,
  call,
} from "redux-saga/effects";
import axios from 'axios';
import {
  ADD_POST_REQUEST,
  ADD_POST_SUCCESS,
  ADD_POST_FAILURE,
  ADD_COMMENT_REQUEST,
  ADD_COMMENT_SUCCESS,
  ADD_COMMENT_FAILURE
} from "../reducers/post";

function* addPostAPI(postData) {
  return axios.post("/post", postData, {
    withCredentials: true, // 로그인한 사용자만 가능하게 쿠키
  });
}

function* addPost(action) {
  try {
    const result = yield call(addPostAPI, action.data)
    yield put({
      type: ADD_POST_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    yield put({
      type: ADD_POST_FAILURE,
      error: e,
    });
  }
}

function* watchAddPost() {
  yield takeLatest(ADD_POST_REQUEST, addPost);
}

function* addCommnetAPI() {}

function* addCommnet(action) {
  //saga도 액션 데이터를 받을 수 있다 여기 액션 데이터는 PostCard 의 onSubmitComment 에서 보낸다
  try {
    yield delay(2000);
    yield put({
      type: ADD_COMMENT_SUCCESS,
      data: {
        postId: action.data.postId,
      },
    });
  } catch (e) {
    yield put({
      type: ADD_COMMENT_FAILURE,
      error: e,
    });
  }
}

function* watchAddCommnet() {
  yield takeLatest(ADD_COMMENT_REQUEST, addCommnet);
}

export default function* postSaga() {
  yield all([fork(watchAddPost), fork(watchAddCommnet)]);
}
