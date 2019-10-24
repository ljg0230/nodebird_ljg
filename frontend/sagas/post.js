import {
  all,
  fork,
  put,
  delay,
  takeLatest,
  call,
  takeEvery,
} from "redux-saga/effects";
import {
  ADD_POST_REQUEST,
  ADD_POST_SUCCESS,
  ADD_POST_FAILURE,
  ADD_COMMENT_REQUEST,
  ADD_COMMENT_SUCCESS,
  ADD_COMMENT_FAILURE,
  LOAD_MAIN_POSTS_REQUEST,
  LOAD_MAIN_POSTS_SUCCESS,
  LOAD_MAIN_POSTS_FAILURE,
  LOAD_HASHTAG_REQUEST,
  LOAD_HASHTAG_SUCCESS,
  LOAD_HASHTAG_FAILURE,
  LOAD_USER_POSTS_REQUEST,
  LOAD_USER_POSTS_SUCCESS,
  LOAD_USER_POSTS_FAILURE,
} from "../reducers/post";
import axios from "axios";

function addPostAPI(postData) {
  return axios.post('/post', postData, {
    withCredentials: true,
  })
}

function* addPost(action) {
  try {
    const result = yield call(addPostAPI, action.data);
    yield put({
      type: ADD_POST_SUCCESS,
      data: result.data,
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

function LoadMainPostsAPI() {
  return axios.get("/posts"); // 로그인을 하지않은 사용자도 메인페이지 게시글을 보이게 
}

function* LoadMainPosts() {
  try {
    const result = yield call(LoadMainPostsAPI);
    yield put({
      type: LOAD_MAIN_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    yield put({
      type: LOAD_MAIN_POSTS_FAILURE,
      error: e,
    });
  }
}

function* watchLoadMainPosts() {
  yield takeLatest(LOAD_MAIN_POSTS_REQUEST, LoadMainPosts);
}

function LoadUserPostsAPI(id) {
  return axios.get(`/user/${id}/posts`); // 로그인을 하지않은 사용자도 메인페이지 게시글을 보이게
}

function* LoadUserPosts(action) {
  try {
    const result = yield call(LoadUserPostsAPI, action.data);
    yield put({
      type: LOAD_USER_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    yield put({
      type: LOAD_USER_POSTS_FAILURE,
      error: e,
    });
  }
}

function* watchLoadUserPosts() {
  yield takeLatest(LOAD_USER_POSTS_REQUEST, LoadUserPosts);
}

function LoadHashtagPostsAPI(tag) {
  return axios.get(`/hashtag/${tag}`); // 로그인을 하지않은 사용자도 메인페이지 게시글을 보이게
}

function* LoadHashtagPosts(action) {
  try {
    const result = yield call(LoadHashtagPostsAPI, action.data);
    yield put({
      type: LOAD_HASHTAG_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    yield put({
      type: LOAD_HASHTAG_FAILURE,
      error: e,
    });
  }
}

function* watchLoadHashtagPosts() {
  yield takeLatest(LOAD_HASHTAG_REQUEST, LoadHashtagPosts);
}

function addCommnetAPI() {}

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
  yield all([
    fork(watchLoadMainPosts),
    fork(watchAddPost),
    fork(watchAddCommnet),
    fork(watchLoadHashtagPosts),
    fork(watchLoadUserPosts),
  ]);
}
