import React, { useState, useCallback } from "react";
import { Form, Input, Checkbox, Button } from "antd";
import { useDispatch } from 'react-redux';
import { signUpRequestAction } from "../reducers/user";
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
          <Button type="primary" htmlType="submit">
            가입하기
          </Button>
        </div>
      </Form>
    </>
  );
};

export default Signup;
