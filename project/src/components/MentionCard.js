import axios from '../axios';
import React, {useState} from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setStatus } from '../app/slices/notifSlice';

export default function MentionCard({author="Dorian", name='Default', pfp, commentAuthor='ComAuth', commentBody='howdy',_id, ideaId, readStatus}) {

  const auth = useSelector(state => state.auth)
  const dispatch = useDispatch()

  const [read, setRead] = useState(readStatus)

  const mentionReplacement = (match) => {
    let mention = JSON.parse(match.slice(2,match.length-2))
    return `@ <span class='green'>${mention.value}</span>`
  }

  function doRegex(input) {
    let regex = /\[\[\{([^}]+)\}]]/gm;
    if (regex.test(input)) {
      return input.replaceAll(regex, mentionReplacement);
    } else {
      return input
    }
  }

  const markRead = (status) =>{
    axios.post(`/notifications/${_id}`, {
      newStatus:status
    }, {
      headers: {
        authorization: auth.token
      }
    }).then(() => {
      getNotifs()
    })
  }

  const getNotifs = () => {
    axios.get('/notifications', {
      headers: {
        authorization:auth.token
      }
    }).then(res => {
      dispatch(setStatus(res.data.notifications.notifications.some(notif => !notif.read)))
    })
  }

  return (
    <Link onClick={() => markRead(true)} to={`/ideas/${ideaId}`}>
    <div className={`flex-grow-1 border-round-xl ${!read ? 'bg-white': null} mentioncard ideacard relative flex flex-row`}>
      {!read ? <img className='absolute top-0 left-0 py-2 px-2' src={require('../assets/unreadCircle.svg').default} alt='unread'/> : null}
      <p onClick={(e) => {
        e.stopPropagation()
        e.preventDefault()
        markRead(!read)
        setRead(!read)
      }} className='blue read-toggle font-16 absolute top-0 right-0 py-2 px-2'>{read ? 'Mark as unread' : 'Mark as read'}</p>
      <div className='md:py-6 md:px-6 sm:flex flex-column hidden col-5 border-right'>
        <p className='mb-1 bodytext'>{author}</p>
        <p className='font-20 g-med'>{name}</p>
      </div>
      <div className='md:py-6 md:px-6 px-5 py-5 sm:col-7 col-12 flex flex-column'>
        <p className='sm:hidden flex flex-column mb-3 font-20 g-med'>{name}</p>
        <div className='flex flex-row md:gap-4 gap-3 my-auto'>
          <img className='w-3rem h-min pfp' src={pfp} alt='pfp' referrerPolicy='no-referrer' />
          <div className='flex-grow-1'>
            <p className='md:font-20 font-16'>{commentAuthor}</p>
            <span className='mt-1 bodytext font-16' dangerouslySetInnerHTML={{__html:doRegex(commentBody)}}></span>
          </div>
        </div>
      </div>
    </div>
    </Link>
  )
}
