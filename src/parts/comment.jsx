import React, { useState,useEffect } from 'react'
import { CommentSection } from 'react-comments-section'
import 'react-comments-section/dist/index.css'
import avatar from "../assets/images/avatar.png"
const CommentInput  = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userCurrent, setUserCurrent] = useState(null);
  const [imageCurrent, setImageCurrent]= useState(null);
  useEffect(() => {
    const userString = localStorage.getItem('user');
    const user = JSON.parse(userString);
    setUserCurrent(user);
    setImageCurrent(user?.avatar || avatar);
    console.log("Giá trị userCurrent:", user);
  }, []);
  const {dataApi} = props
  // const [data] = useState([
  //   {
  //     userId: userCurrent?.userId || ''      ,
  //     comId: '012',
  //     fullName: 'Riya Negi',
  //     avatarUrl: 'https://ui-avatars.com/api/name=Riya&background=random',
  //     userProfile: 'https://www.linkedin.com/in/riya-negi-8879631a9/',
  //     text: `<p>Tớ đã đọc, rất hay</p>`,
  //     replies: [
  //       {
  //         userId: '02a',
  //         comId: '013',
  //         userProfile: 'https://www.linkedin.com/in/riya-negi-8879631a9/',
  //         fullName: 'Adam Scott',
  //         avatarUrl: 'https://ui-avatars.com/api/name=Adam&background=random',
  //         text: `<p>Cảm ơn bạn</p>`
  //       },
  //     ]
  //   },
  // ])
  const [data] = dataApi && dataApi.comments
  ? dataApi.comments.map(comment => ({
      userId: comment.user.id,
      comId: comment.id,
      fullName: comment.user.fullName ? comment.user.fullName : 'Unknow',
      avatarUrl: comment.user.avatar ? comment.user.avatar : avatar,
      userProfile: '#',
      text: comment.comment ? comment.comment : '',
      replies: comment.replies.map(reply => ({
        userId: reply.user.id,
        comId: reply.id,
        userProfile: '#',
        fullName: reply.user.fullName ? reply.user.fullName : 'Unknow',
        avatarUrl: reply.user.avatar ? reply.user.avatar : avatar,
        text: reply.comment ? reply.comment : '',
      })),
    }))
  : [];
  console.log("data  dataApi là: ",dataApi)
  console.log("Type of dataApi:", typeof dataApi)
  console.log("data là: ",data)
  return (
    <div style={{ width: '100%' }}>
      <CommentSection
        currentUser={{
          currentUserId: userCurrent?.userId || '',
          currentUserImg:userCurrent? userCurrent.avatar : avatar ,
          currentUserProfile:'#',
          currentUserFullName: userCurrent?.fullName || ''
        }}
        hrStyle={{ border: '0.5px solid #ff0072' }}
        commentData={data}
        currentData={(data) => {
          console.log('curent data', data)
        }}
        logIn={{
          loginLink: 'http://localhost:3000/post/login',
          signupLink: 'http://localhost:3000/'
        }}
        customImg= {imageCurrent}
        inputStyle={{ border: '1px solid rgb(208 208 208)' }}
        formStyle={{ backgroundColor: 'white' }}
        submitBtnStyle={{
          border: '1px solid black',
          backgroundColor: 'black',
          padding: '7px 15px'
        }}
        cancelBtnStyle={{
          border: '1px solid gray',
          backgroundColor: 'gray',
          color: 'white',
          padding: '7px 15px'
        }}
        advancedInput={true}
        replyInputStyle={{ borderBottom: '1px solid black', color: 'black' }}
      />
    </div>
  )
}

export default CommentInput 