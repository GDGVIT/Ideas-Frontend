import React, { useEffect, useState } from 'react'
import MentionCard from '../components/MentionCard'
import { useSelector, useDispatch } from 'react-redux'
import axios from '../axios'
import { setStatus } from '../app/slices/notifSlice'
import Skeleton from 'react-loading-skeleton'
import Layout from '../components/Layout'

export default function MentionNotif () {
  const dispatch = useDispatch()
  const auth = useSelector(state => state.auth)
  const [notifs, setNotifs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getNotifs = () => {
      axios.get('/notifications', {
        headers: {
          authorization: auth.token
        }
      }).then(res => {
        if (res.data.notifications && res.data.notifications.notifications) {
          dispatch(setStatus(res.data.notifications.notifications.some(notif => !notif.read)))
          setNotifs(res.data.notifications.notifications.reverse())
        }
        setLoading(false)
      })
    }
    if (auth.token) {
      getNotifs()
    }
  }, [auth, dispatch])

  // const clearNotifs = async () => {
  //   setLoading(true)
  //   await axios.delete('/notifications', {
  //     headers: {
  //       authorization: auth.token
  //     }
  //   })
  //   setNotifs([])
  //   setLoading(false)
  // }

  return (
    <Layout>
      <div className='flex flex-column gap-4'>
        <span className='flex flex-row justify-content-between align-items-center'>
          <h1 className='g-bold text-xl'>Notifications</h1>
          {/* <p onClick={clearNotifs} className='button bodytext'>Clear all</p> */}
        </span>
        {!loading
          ? (notifs.length
              ? (notifs.map((notif, index) => {
                  return <MentionCard key={index} commentBody={notif.sourceBody} readStatus={notif.read} _id={notif._id} name={notif.parentIdeaTitle} pfp={notif.commentAuthorPicture} author={notif.parentIdeaAuthorName} commentAuthor={notif.commentAuthorName} ideaId={notif.parentIdeaId} />
                }))
              : <p className='bodytext font-16'>No notifications yet.</p>)
          : <Skeleton containerClassName='flex flex-column gap-1' height={100} count={5} />}
      </div>
    </Layout>
  )
}
