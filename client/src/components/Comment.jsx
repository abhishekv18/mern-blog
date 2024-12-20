import React from 'react'
import moment from 'moment';
import { useState } from 'react';
import { useEffect } from 'react';
import { FaThumbsUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';
export default function Comment({comment,onLike,onDelete}) {
    const [user, setUser] = useState({});
    const { currentUser } = useSelector((state) => state.user);
    console.log(user);
    useEffect(() => {
        const getUser = async () => {
          try {
            const res = await fetch(`/api/user/${comment.userId}`);
            const data = await res.json();
            if (res.ok) {
              setUser(data);
            }
          } catch (error) {
            console.log(error.message);
          }
        };
        getUser();
      }, [comment]);
  return (
    <div className='flex p-4 border-b dark:border-gray-600 text-sm gap-2'>
                 <div className='flex-shrink-0' >
                    <img src={user.profilePicture} alt={user.username} className='w-10 h-10 rounded-full bg-gray-500'/>
                 </div>
                 <div className='flex-1'>
                    <div className='flex items-center mb-1'>
                        <span className='font-bold mr-1 text-xs truncate '>{user? `@${user.username}`:'anonymous user'} </span>
                        <span className='text-gray-500 text-xs'>
                     {   moment(comment.createdAt).fromNow()    }
                        </span>
                    </div>
                    <p  className='text-gray-500 pb-2'>{comment.content}</p>
                    <div className='flex items-center gap-1 pt-2 text-xs border-t max-w-fit dark:border-gray-400'>
                      <button className={`text-gray-400 hover:text-blue-500 ${
                  currentUser &&
                  comment.likes.includes(currentUser._id) &&
                  '!text-blue-500'
                }`} type='button' onClick={()=>onLike(comment._id)}>
                        <FaThumbsUp className='text-sm'/>
                      </button >
                      <p className='text-gray-400'>
                        {
                          comment.numberOfLikes>0 && comment.numberOfLikes + " " +(comment.numberOfLikes===1?"Like":"Likes")
                        }
                      </p>
                      {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <>
                
                    <button
                      type='button'
                      onClick={() => onDelete(comment._id)}
                      className='text-gray-400 hover:text-red-500'
                    >
                      Delete
                    </button>
                  </>
                )}
                    </div>
                 </div>
    </div>
  )//! means important so overwritten
}
