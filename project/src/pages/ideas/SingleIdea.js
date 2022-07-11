import axios from '../../axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function SingleIdea () {
  const { id } = useParams()
  const auth = useSelector(state => state.auth)
  const [idea, setIdea] = useState({})
  const [comments, setComments] = useState([])

  useEffect(() => {
    const getIdea = async () => {
      await axios
        .get(`/ideas/${id}`, {
          headers: {
            authorization: auth.token
          }
        })
        .then(res => {
          setIdea(res.data.idea)
          setComments(res.data.comments)
        })
    }
    getIdea()
  }, [auth, id])
  return (
    <div className='border-round-xl p-8 bg-white ideacard'>
      <div style={{ fontSize: 20 }} className='flex gap-1 flex-row'>
        <p>{idea.authorName}</p>
        <p className='bodytext'>|</p>
        <p className='bodytext'>{idea.createdOn}</p>
      </div>
      <h1>{idea.title}</h1>
    </div>
  )
}
