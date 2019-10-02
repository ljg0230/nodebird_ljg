import {
  all,
  fork,
  put,
  delay,
  takeLatest,
  takeEvery
} from "redux-saga/effects";
import {
  ADD_POST_REQUEST,
  ADD_POST_SUCCESS,
  ADD_POST_FAILURE,
  ADD_COMMENT_REQUEST,
  ADD_COMMENT_SUCCESS,
  ADD_COMMENT_FAILURE
} from "../reducers/post";

function* addPostAPI() {}

function* addPost() {
  try {
    yield delay(2000);
    yield put({
      type: ADD_POST_SUCCESS
    });
  } catch (e) {
    yield put({
      type: ADD_POST_FAILURE,
      error: e
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
