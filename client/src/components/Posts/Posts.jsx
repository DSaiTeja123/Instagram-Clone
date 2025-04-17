import React from 'react'
import { Post } from '../index'
import { useSelector } from 'react-redux'

function Posts() {
  const { posts } = useSelector(store => store.post);
  return (
    <div>
      {
        posts.map((post) => <Post key={post._id} post={post} />)
      }
    </div>
  )
}

export default Posts