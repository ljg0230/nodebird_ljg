import React, { useState, useCallback, useEffect } from "react";
import { Form, Input, Checkbox, Button } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import { signUpRequestAction } from "../reducers/user";
import Router from 'next/router';
import PropTypes from 'prop-types';

const TextInput = ({ value }) => {
  return (
    <div>{value}</div>
  )
};

TextInput.propTypes = {
  value: PropTypes.string,
}

export const useInput = (initValue = null) => {
  // 커스텀 hook으로 중복되는 내용을 줄임
  const [value, setter] = useState(initValue);
  const handler = useCallback(e => {
    setter(e.target.value);
  }, []);
  return [value, handler];
};

const Signup = () => {
  const [passwordCheck, setPasswordCheck] = useState("");
  const [term, setTerm] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [termError, setTermError] = useState(false);

  const [id, onChangeId] = useInput("");
  const [nick, onChangeNick] = useInput("");
  const [password, onChangePassword] = useInput("");
  const dispatch = useDispatch();
  const { isSigningUp, me } = useSelector(state => state.user);

  useEffect(() => {
    if(me) {
      alert('로그인 성공. 메인페이지로 이동합니다.');
      Router.push('/'); //내 id값이 들어오면(로그인 시) 메인페이지로 이동한다
    }
  }, [me && me.id]); //비교의 용이함을 위해 me.id(일반값)를 씀, js는 항상 undefined 일 수 있으므로 && (가드)를 해준다

  const onSubmit = useCallback(
    e => {
      e.preventDefault();
      if (password !== passwordCheck) {
        return setPasswordError(true);
      }
      if (!term) {
        return setTermError(true);
      }
      dispatch(signUpRequestAction({
        id,
        password,
        nick,
      }))
    },
    [password, passwordCheck, term]
  );

  const onChangePasswordCheck = useCallback(
    e => {
      setPasswordError(e.target.value !== password);
      setPasswordCheck(e.target.value);
    },
    [password]
  );

  const onChangeTerm = useCallback(e => {
    setTermError(false);
    setTerm(e.target.checked);
  }, []);

  return (
    <>
      <Form onSubmit={onSubmit} style={{ padding: 10 }}>
        <div>
          <label htmlFor="user-id">아이디</label>
          <br />
          <Input name="user-id" value={id} required onChange={onChangeId} />
        </div>
        <div>
          <label htmlFor="user-nick">닉네임</label>
          <br />
          <Input
            name="user-nick"
            value={nick}
            required
            onChange={onChangeNick}
          />
        </div>
        <div>
          <label htmlFor="user-pass">비밀번호</label>
          <br />
          <Input
            name="user-pass"
            type="password"
            value={password}
            required
            onChange={onChangePassword}
          />
        </div>
        <div>
          <label htmlFor="user-pass-chk">비밀번호체크</label>
          <br />
          <Input
            name="user-pass-chk"
            type="password"
            value={passwordCheck}
            required
            onChange={onChangePasswordCheck}
          />
          {passwordError && (
            <div style={{ color: "red" }}>비밀번호가 일치하지 않습니다.</div>
          )}
        </div>
        <div>
          <Checkbox name="user-term" value={term} onChange={onChangeTerm}>
            열심히 할 거야?
          </Checkbox>
          {termError && (
            <div style={{ color: "red" }}>약관에 동의하셔야 합니다.</div>
          )}
        </div>
        <div style={{ marginTop: 10 }}>
          <Button type="primary" loading={isSigningUp} htmlType="submit">
            가입하기
          </Button>
        </div>
      </Form>
    </>
  );
};

export default Signup;
