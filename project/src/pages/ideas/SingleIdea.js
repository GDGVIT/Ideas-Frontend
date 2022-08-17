import axios from '../../axios'
import React, { useCallback, useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import dayjs from 'dayjs'
import { MentionsInput, Mention } from 'react-mentions'
import { toast } from 'react-toastify';

export default function SingleIdea () {
  const { id } = useParams()
  const auth = useSelector(state => state.auth)
  const [idea, setIdea] = useState({ tags: [] })
  const [upvoteCount, setUpvoteCount] = useState(0)
  const [date, setDate] = useState('')
  const [hearted, setHearted] = useState(false)
  const [comments, setComments] = useState([])
  const [newComment, getNewComment] = useState('')
  const [userId, setUserId] = useState('')
  const navigate = useNavigate()
  const [userStrings, setUserStrings] = useState([])
  const [warned, setWarned] = useState(false)

  const fetchUsers = useCallback( async () => {
    await axios
      .get('/user', {
        headers: {
          authorization: auth.token
        }
      })
      .then(res => {
        setUserStrings(res.data.users.map(user => ({display: user.name, id:user._id})))
      })
  },[auth])

  const getIdea = useCallback(
    async () => {
      await axios
        .get(`/ideas/${id}`, {
          headers: {
            authorization: auth.token
          }
        })
        .then(res => {
          setIdea(res.data.idea)
          setDate(dayjs(res.data.idea.createdOn).format('DD-MM-YYYY'))
          setUpvoteCount(res.data.idea.upvotes.length)
          if (res.data.idea.upvotes.includes(auth._id)) {
            setHearted(true)
          }
          setComments(res.data.comments)
        })
    }, [auth, id]
  )

  const submitComment = async (e) => {
    e.preventDefault()
    const commentObject = {
      commentBody: newComment
    }
    if (commentObject.commentBody !== '') {
      await axios
        .post(`/ideas/${id}/comments`, commentObject, {
          headers: {
            authorization: auth.token
          }
        }).then(() => {
          getNewComment('')
          getIdea()
        })
    }
  }

  const sendVote = (add) => {
    let voteType
    if (add) {
      voteType = 1
      setHearted(true)
      setUpvoteCount(upvoteCount + 1)
    } else {
      voteType = 0
      setUpvoteCount(upvoteCount - 1)
      setHearted(false)
    }
    axios.patch(`/ideas/${id}/vote`, {
      voteType
    }, {
      headers: {
        authorization: auth.token
      }
    })
  }

  const deleteWarn = () => {
    toast.warn('Click again to delete.')
    setWarned(true)
  }

  const deleteIdea = async () => {
    await axios.delete
    (`/ideas/${id}`, {
      headers: {
        authorization: auth.token
      }
    })
    .then(() => {
      toast.success('Idea deleted :(')
      navigate('/ideas')
    })
  }

  const deleteComment = async (commentId) => {
    await axios.delete(`/ideas/comments/${commentId}`, {
      headers: {
        authorization: auth.token
      }
    })
    .then(() => {
      getIdea()
    })
  }

  useEffect(() => {
    if (auth.token) {
      getIdea()
      setUserId(auth._id)
      fetchUsers()
    }
  }, [auth, id, getIdea, fetchUsers])

  return (
    <div className='border-round-xl p-8 bg-white ideacard relative'>
      <Link to='/ideas'>
        <img className='absolute top-0 left-0 m-5' src={require('../../assets/backArrow.svg').default} alt='back-arrow' />
      </Link>
      <div className='flex flex-row gap-8'>
        <div>
          <div className='flex gap-1 flex-row align-items-center'>
            <p className='bodytext font-20'>{idea.authorName}</p>
            <p className='font-20 bodytext'>|</p>
            <p className='font-16 datetext'>{date}</p>
          </div>
          <h1 className='font-bold'>{idea.title}</h1>
        </div>
        <div className='flex flex-row gap-2 h-min mt-auto align-items-center'>
          <p style={{ color: '#FF6B6B' }}>{upvoteCount}</p>
          {hearted ? <img onClick={() => sendVote(0)} src={require('../../assets/fullHeart.svg').default} alt='heart' style={{ height: '1.5rem' }} /> : <img onClick={() => sendVote(1)} src={require('../../assets/hollowHeart.svg').default} style={{ height: '1.5rem' }} alt='heart' />}
          {idea.author && idea.author._id === userId && <Link className='flex' to={`/ideas/edit/${id}`}>
            <img className='pl-2 m-auto' src={require('../../assets/edit-icon.svg').default} alt='edit'></img>
          </Link>}
          {idea.author && idea.author._id === userId && warned ? 
          <img onClick={deleteIdea} className='pl-2' height={28} src={require('../../assets/trash-bin.svg').default} alt='trash'></img> :
            <img onClick={deleteWarn} className='pl-2' height={28} src={require('../../assets/trash-bin.svg').default} alt='trash'></img>}
        </div>
      </div>
      <p className='mt-4 bodytext font-16'>{idea.description}</p>
      <div className='font-20 text-white mt-5 flex flex-row flex-wrap gap-2'>
        {idea.tags.map((tag, index) => {
          return <p className='p-1 px-3 tag' style={{ backgroundColor: '#F0B501' }} key={index}>{tag}</p>
        })}
      </div>
      <div className='relative mt-7'>
        <form onSubmit={submitComment}>
        {/* <MentionsInput
          value={newComment}
          onChange={(e) => { getNewComment(e.target.value) }}
          style={{ fontSize: 16 }}
          placeholder='Add a comment...'
          className='comment-input'
          a11ySuggestionsListLabel={"Suggested Github users for mention"}
          rows={1}
        >
          <Mention
            displayTransform={login => `@${login}`}
            trigger="@"
            data={userStrings}
          />
        </MentionsInput> */}
          <input
            style={{ fontSize: 16 }}
            placeholder='Add a comment...' className='bodytext comment-input' value={newComment} onChange={(e) => { getNewComment(e.target.value) }}
          />
        </form>
        <img src={require('../../assets/messageSymbol.svg').default} alt='commentIcon' className='comment-icon absolute top-50 left-0' />
      </div>
      <div className='mt-6 px-6 flex flex-column gap-4'>
        {comments.map((comment, index) => {
          return (
            <div key={index} className='grid gap-4'>
              <img width={43} className='pfp' src={comment.author.picture} alt='pfp' referrerPolicy='no-referrer' />
              <div className='flex-grow-1'>
                <p className='font-20'>{comment.authorName}</p>
                <p className='mt-1 bodytext font-16'>{comment.body}</p>
              </div>
              {comment.author && comment.author._id === userId &&
                <img onClick={() => deleteComment(comment._id)} className='pl-2' height={28} src={require('../../assets/trash-bin.svg').default} alt='trash'></img>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
