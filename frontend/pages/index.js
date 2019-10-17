import React from "react";
import { useSelector } from 'react-redux';
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";

const Home = () => {
  const { me } = useSelector(state => state.user);
  const { mainPosts } = useSelector(state => state.post);
  
  return (
      <div>
        {me && <PostForm />}
        {mainPosts.map(c => {
          return (<PostCard key={Math.random()} post={c} />);
        })}
      </div>
  );
};

export default Home;
