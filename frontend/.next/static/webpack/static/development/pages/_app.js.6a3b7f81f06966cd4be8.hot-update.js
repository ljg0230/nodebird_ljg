webpackHotUpdate("static\\development\\pages\\_app.js",{

/***/ "./pages/_app.js":
/*!***********************!*\
  !*** ./pages/_app.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/head */ "./node_modules/next/dist/next-server/lib/head.js");
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_head__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var next_redux_wrapper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next-redux-wrapper */ "./node_modules/next-redux-wrapper/es6/index.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! redux */ "./node_modules/redux/es/redux.js");
/* harmony import */ var redux_saga__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! redux-saga */ "./node_modules/redux-saga/dist/redux-saga-core-npm-proxy.esm.js");
/* harmony import */ var _components_AppLayout__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../components/AppLayout */ "./components/AppLayout.js");
/* harmony import */ var _reducers__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../reducers */ "./reducers/index.js");
/* harmony import */ var _sagas__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../sagas */ "./sagas/index.js");
var _jsxFileName = "D:\\\uC774\uC815\uAC78\\web\\react_nodebird\\frontend\\pages\\_app.js";
var __jsx = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement;











var NodeBird = function NodeBird(_ref) {
  var Component = _ref.Component,
      store = _ref.store;
  return __jsx(react_redux__WEBPACK_IMPORTED_MODULE_4__["Provider"], {
    store: store,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 14
    },
    __self: this
  }, __jsx(next_head__WEBPACK_IMPORTED_MODULE_1___default.a, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 15
    },
    __self: this
  }, __jsx("title", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 16
    },
    __self: this
  }, "NodeBird"), __jsx("link", {
    rel: "stylesheet",
    href: "https://cdnjs.cloudflare.com/ajax/libs/antd/3.23.3/antd.css",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 17
    },
    __self: this
  })), __jsx(_components_AppLayout__WEBPACK_IMPORTED_MODULE_7__["default"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 22
    },
    __self: this
  }, __jsx(Component, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 23
    },
    __self: this
  })));
};

NodeBird.propTypes = {
  Component: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.elementType.isRequired,
  store: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.object.isRequired
};

var configureStore = function configureStore(initialState, options) {
  //store를 props로 넘겨주기 위해 고차컴포넌트를 사용해서 확장한다
  //이 형식은 대부분 이렇게 쓰이므로 외워서 사용하는게 좋을 듯 싶다
  var sagaMiddleware = Object(redux_saga__WEBPACK_IMPORTED_MODULE_6__["default"])();
  var middlewares = [sagaMiddleware]; // 다른 미들웨어를 추가하더라도 이 부분만 바뀐다

  var enhancer =  false ? undefined : Object(redux__WEBPACK_IMPORTED_MODULE_5__["compose"])(redux__WEBPACK_IMPORTED_MODULE_5__["applyMiddleware"].apply(void 0, middlewares), !options.isServer && window.__REDUX_DEVTOOLS_EXTENSION__ !== "undefined" ? window.__REDUX_DEVTOOLS_EXTENSION__() : function (f) {
    return f;
  });
  var store = Object(redux__WEBPACK_IMPORTED_MODULE_5__["createStore"])(_reducers__WEBPACK_IMPORTED_MODULE_8__["default"], initialState, enhancer); //여기에다가 store 커스터마이징

  sagaMiddleware.run(_sagas__WEBPACK_IMPORTED_MODULE_9__["default"]);
  return store;
};

/* harmony default export */ __webpack_exports__["default"] = (Object(next_redux_wrapper__WEBPACK_IMPORTED_MODULE_3__["default"])(configureStore)(NodeBird));

/***/ })

})
//# sourceMappingURL=_app.js.6a3b7f81f06966cd4be8.hot-update.js.map