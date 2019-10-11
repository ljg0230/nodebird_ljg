import { all, call } from 'redux-saga/effects';
import axios from 'axios';
import user from './user';
import post from './post';

axios.defaults.baseURL = "http://localhost:3066/api"; // node 에서 캐싱을 해줘서 모듈 공유가 가능하나 공통인 부분은 여기(index) 정리하자

export default function* rootSaga() {
    yield all([
        call(user),
        call(post),
    ]);
};