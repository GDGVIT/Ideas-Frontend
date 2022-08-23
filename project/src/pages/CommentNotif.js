import React, {useState, useEffect, useCallback} from 'react'
import axios from '../axios'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import IdeaCard from '../components/IdeaCard'
import Skeleton from 'react-loading-skeleton'
import { setStatus } from '../app/slices/notifSlice'

export default function CommentNotif() {
  const dispatch = useDispatch()
  const [ownComments, setOwnComments] = useState([])
  const [userIdeas, setUserIdeas] = useState([])
  const [ownCommentsLoading, setOwnCommentLoading] = useState(true)
  const [userIdeasLoading, setUserIdeasLoading] = useState(true)

  const auth = useSelector(state => state.auth)

  useEffect(()=>{
    const getNotifs = () => {
      axios.get('/notifications', {
        headers: {
          authorization:auth.token
        }
      }).then(res => {
        dispatch(setStatus(res.data.notifications.notifications.some(notif => !notif.read)))
      })
    }
    if (auth.token) {
      getNotifs()
    }
  },[auth, dispatch])

  const fetchOwnComments = useCallback(() => {
    axios.get(`/user/${auth._id}/comments`, {
      headers: {
        authorization: auth.token
      }
    })
    .then((res) => {
      for (let i = 0; i<res.data.comments.length ; i++) {
        res.data.comments[i].body = doRegex(res.data.comments[i].body);
        console.log(res.data.comments[i].body)
      }
      setOwnComments(res.data.comments.reverse())
      setOwnCommentLoading(false)
    })
  },[auth])

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

  const fetchUserPosts = useCallback(
    async () => {
      await axios
        .get(`/ideas/user/${auth._id}`, {
          headers: {
            authorization: auth.token
          }
        })
        .then((res) => {
          console.log(res.data)
          setUserIdeas(res.data.ideas.sort(function(a,b){
            return new Date(b.createdOn) - new Date(a.createdOn);
          }))
          setUserIdeasLoading(false)
        })
        .catch(e => console.log(e))
    }, [auth]
  )

  useEffect(() => {
    if (auth.token) {
      fetchOwnComments()
      fetchUserPosts()
    }
  }, [auth, fetchOwnComments, fetchUserPosts])

  return (
    <div className='negmar-ideas grid md:gap-0 gap-6'>
      <div className="md:col-5 col-12">
        <h1 className='g-bold text-xl'>Your Comments</h1>
        {!ownCommentsLoading ? 
        <div className='mt-4 flex flex-column gap-3'>
        {!ownCommentsLoading ? ownComments.map((comment, index) => {
          return (
            <div key={index} className='flex-grow-1 border-round-xl py-3 px-4 bg-white ideacard md:w-11'>
              <Link to={`/ideas/${comment.ideaId}`}><p className='font-16'>{comment.ideaTitle}</p></Link>
              <span dangerouslySetInnerHTML={{__html:comment.body}} className='bodytext'></span>
            </div>
          )
        }) : <p className='bodytext mt-4'>You haven't made any comments 😔</p>}
        </div> : <Skeleton className='w-11 mt-4 border-round-xl' height={100} count={25} />}
      </div>
      <div className="md:col-7 col-12">
        <h1 className='g-bold text-xl'>Comments on your Ideas</h1>
        {!userIdeasLoading ?
        <div className='mt-4 flex flex-column gap-3'>
          {userIdeas.length ? userIdeas.map((idea, index) => {
            return idea.comments.length ? 
              <IdeaCard key={index} name={idea.title} tags={idea.tags} ideaId={idea._id} hearted={idea.upvotes.includes(auth._id)} upvoteCount={idea.upvotes.length} comments={idea.comments.reverse()}></IdeaCard> : null
          }) : <p className='bodytext mt-4'>Nothing to see here, yet 😔</p>}
        </div> : <Skeleton containerClassName='flex flex-column gap-2' className='mt-4 border-round-xl' height={150} count={25} />}
      </div>
    </div>
  )
}
