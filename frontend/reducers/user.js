const dummyUser = {
  nickname: "이정걸",
  Post: [],
  Followings: [],
  Followers: [],
  signUpData: {}
};

export const initialState = {
  isLoggedIn: false,
  user: null
};

//액션의 이름
export const SIGN_UP_REQUEST = "SIGN_UP_REQUEST";
export const SIGN_UP_SUCCESS = "SIGN_UP_SUCCESS";
export const SIGN_UP_FAILURE = "SIGN_UP_FAILURE";

export const LOG_IN_REQUEST = "LOG_IN_REQUEST";
export const LOG_IN_SUCCESS = "LOG_IN_SUCCESS";
export const LOG_IN_FAILURE = "LOG_IN_FAILURE";

export const LOG_OUT_REQUEST = "LOG_OUT_REQUEST";
export const LOG_OUT_SUCCESS = "LOG_OUT_SUCCESS";
export const LOG_OUT_FAILURE = "LOG_OUT_FAILURE";

export const signUpAction = data => ({
  // 동적 데이터 처리를 위해 함수로 만든다
  type: SIGN_UP,
  data: data,
});

export const signUpSuccess = {
  type: SIGN_UP_SUCCESS
};

export const loginAction = data => ({
  type: LOG_IN_REQUEST,
  data: data,
});

export const logoutAction = {
  type: LOG_OUT_REQUEST
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOG_IN_REQUEST: {
      return {
        ...state,
        loginData: action.data,
        isLoading: true,
      };
    }
    case LOG_IN_SUCCESS: {
      return {
        ...state,
        isLoggedIn: true,
        user: dummyUser,
        isLoading: false,
      };
    }
    case LOG_OUT_REQUEST: {
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      };
    }
    case SIGN_UP_REQUEST: {
      return {
        ...state,
        signUpData: action.data,
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
};

export default reducer;
