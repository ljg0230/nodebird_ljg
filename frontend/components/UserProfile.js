import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, Avatar, Button } from "antd";
import { logoutRequestAction } from "../reducers/user";

const UserProfile = () => {
  const { me } = useSelector(state => state.user);
  const dispatch = useDispatch();

  const onLogout = useCallback(() => {
    // useCallback을 하는 이유는 자식컴포넌트에 props로 전달하기 때문
    dispatch(logoutRequestAction);
  }, []);
  return (
    <Card
      actions={[
        <div key="twit">
          짹짹!
          <br />
          {me.Post.length}
        </div>,
        <div key="following">
          팔로잉
          <br />
          {me.Followings.length}
        </div>,
        <div key="follower">
          팔로워
          <br />
          {me.Followers.length}
        </div>
      ]}
    >
      <Card.Meta
        avatar={<Avatar>{me.nickname[0]}</Avatar>}
        title={me.nickname}
      />
      <Button style={{ margin: '20px -10px 0'}} onClick={onLogout}>로그아웃</Button>
    </Card>
  );
};

export default UserProfile;
