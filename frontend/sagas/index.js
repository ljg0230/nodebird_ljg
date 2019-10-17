import { all, call } from 'redux-saga/effects';
import axios from 'axios';
import user from './user';
import post from './post';

axios.defaults.baseURL = "http://localhost:3066/api"; // 공통으로 쓰이는 부분은 이곳에 .. 공유가 됨

export default function* rootSaga() {
    yield all([
        call(user),
        call(post),
    ]);
};