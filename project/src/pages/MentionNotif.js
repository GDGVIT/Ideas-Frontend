import React, {useEffect, useState} from 'react'
import MentionCard from '../components/MentionCard'
import { useSelector, useDispatch } from 'react-redux'
import axios from '../axios'
import { setStatus } from '../app/slices/notifSlice'

export default function MentionNotif() {
  const dispatch = useDispatch()
  const auth = useSelector(state => state.auth)
  const [notifs, setNotifs] = useState([])

  useEffect(()=>{
    const getNotifs = () => {
      axios.get('/notifications', {
        headers: {
          authorization:auth.token
        }
      }).then(res => {
        dispatch(setStatus(res.data.notifications.notifications.some(notif => !notif.read)))
        setNotifs(res.data.notifications.notifications)
      })
    }
    if (auth.token) {
      getNotifs()
    }
  },[auth, dispatch])

  return (
    <div className='flex flex-column gap-3'>
      <h1 className='g-bold text-xl'>Notifications</h1>
      {notifs.map((notif, index) => {
        return <MentionCard commentBody={notif.sourceBody} readStatus={notif.read}></MentionCard>
      })}
    </div>
  )
}
