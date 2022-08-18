import React, {useState, useEffect, useCallback} from 'react'
import axios from '../axios'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import IdeaCard from '../components/IdeaCard'
import Skeleton from 'react-loading-skeleton'

export default function CommentNotif() {
  const [ownComments, setOwnComments] = useState([])
  const [userIdeas, setUserIdeas] = useState([])
  const [ownCommentsLoading, setOwnCommentLoading] = useState(true)
  const [userIdeasLoading, setUserIdeasLoading] = useState(true)

  const auth = useSelector(state => state.auth)

  const fetchOwnComments = useCallback(() => {
    axios.get(`/user/${auth._id}/comments`, {
      headers: {
        authorization: auth.token
      }
    })
    .then((res) => {
      setOwnComments(res.data.comments)
      setOwnCommentLoading(false)
    })
  },[auth])

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
          setUserIdeas(res.data.ideas)
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
    <div className='grid md:gap-0 gap-6'>
      <div className="md:col-5 col-12">
        <h1 className='text-xl'>Your Comments</h1>
        {!ownCommentsLoading ? 
        <div className='mt-4 flex flex-column gap-3'>
        {!ownCommentsLoading ? ownComments.map((comment, index) => {
          return (
            <div key={index} className='flex-grow-1 border-round-xl py-3 px-4 bg-white ideacard md:w-11'>
              <Link to={`/ideas/${comment.ideaId}`}><p className='font-16'>{comment.ideaTitle}</p></Link>
              <p className='bodytext'>{comment.body}</p>
            </div>
          )
        }) : <IdeaCard name='Oops' description='Nothing to see here.' tags={[]} disabled={true} />}
        </div> : <Skeleton className='w-11 mt-4 border-round-xl' height={100} count={25} />}
      </div>
      <div className="md:col-7 col-12">
        <h1 className='text-xl'>Comments on your Ideas</h1>
        {!userIdeasLoading ?
        <div className='mt-4 flex flex-column gap-3'>
          {userIdeas.length ? userIdeas.map((idea, index) => {
            return (
              <IdeaCard key={index} name={idea.title} tags={idea.tags} ideaId={idea._id} hearted={idea.upvotes.includes(auth._id)} upvoteCount={idea.upvotes.length} comments={idea.comments}></IdeaCard>
            )
          }) : <IdeaCard name='Oops' description='Nothing to see here.' tags={[]} disabled={true} />}
        </div> : <Skeleton containerClassName='flex flex-column gap-2' className='mt-4 border-round-xl' height={150} count={25} />}
      </div>
    </div>
  )
}
