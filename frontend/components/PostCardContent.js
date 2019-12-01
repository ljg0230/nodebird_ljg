import React from 'react';
import Link from "next/link";
import PropTypes from 'prop-types';

const PostCardContent = ({ postData }) => {
  return (
    <div>
      {postData.split(/(#[^\s]+)/g).map(v => {
        // 해시태그의 링크넣기 -> a tag가 아닌 next의 Link를 써야 spa 가 유지가 된다
        if (v.match(/#[^\s]+/)) {
          return (
            <Link
              href={{
                pathname: "/hashtag",
                query: { tag: v.slice(1) }
              }}
              as={`/hashtag/${v.slice(1)}`}
              key={v}
            >
              <a>{v}</a>
            </Link>
          );
        }
        return v;
      })}
    </div>
  );
};

PostCardContent.propTypes = {
    postData: PropTypes.string.isRequired,
}

export default PostCardContent;
