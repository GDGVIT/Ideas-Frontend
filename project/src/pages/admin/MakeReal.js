import React, { useCallback, useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from '../../axios'
import Layout from '../../components/Layout'
import Skeleton from 'react-loading-skeleton'
import Toggle from 'react-toggle'
import 'react-toggle/style.css'
import { toast } from 'react-toastify'

export default function MakeReal () {
  const { id } = useParams()
  const [idea, setIdea] = useState({ tags: [] })
  const [gitlinkInput, setGitlinkInput] = useState('')
  const [gitlinks, setGitlinks] = useState([])
  const [deployedURLsInput, setDeployedURLsInput] = useState('')
  const [deployedURLs, setDeployedURLs] = useState([])
  const [madeReal, setMadeReal] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [origMadeReal, setOrigMadeReal] = useState(false)
  const navigate = useNavigate()

  const auth = useSelector(state => state.auth)
  const getIdea = useCallback(
    async (e) => {
      await axios
        .get(`/ideas/${id}`, {
          headers: {
            authorization: auth.token
          }
        })
        .then(res => {
          setIdea(res.data.idea)
          setGitlinks(res.data.idea.gitLinks)
          setDeployedURLs(res.data.idea.deployedURLs)
          setMadeReal(res.data.idea.madeReal)
          setOrigMadeReal(res.data.idea.madeReal)
        })
    }, [auth, id]
  )

  const addGitlink = (e) => {
    if (e.key === 'Enter') {
      setGitlinks([...gitlinks, gitlinkInput])
      setGitlinkInput('')
    }
  }
  const deleteGitlink = (i) => {
    setGitlinks(gitlinks.filter((item, index) => index !== i))
  }

  const addDeployedURL = (e) => {
    if (e.key === 'Enter') {
      setDeployedURLs([...deployedURLs, deployedURLsInput])
      setDeployedURLsInput('')
    }
  }
  const deleteDeployedURL = (i) => {
    setDeployedURLs(deployedURLs.filter((item, index) => index !== i))
  }

  const submit = async (e) => {
    setSubmitLoading(true)
    e.preventDefault()
    try {
      if (origMadeReal) {
        await axios.patch(`/admin/makeReal/${id}`, {
          madeReal: 'false'
        }, {
          headers: {
            authorization: auth.token
          }
        })
      } else {
        await axios.patch(`/admin/makeReal/${id}`, {
        }, {
          headers: {
            authorization: auth.token
          }
        })
      }
      await axios.post(`/admin/makeReal/${id}`, {
        gitLinks: gitlinks,
        deployedURLs
      }, {
        headers: {
          authorization: auth.token
        }
      })
      navigate('/admin/accepted')
    } catch {
      toast.error('Unexpected failure.')
    }
    setSubmitLoading(false)
  }

  useEffect(() => {
    getIdea()
  }, [getIdea])

  return (
    <Layout admin>
      <div className='negmar-ideas border-round-xl py-7  md:px-8 sm:px-7 px-5 bg-white ideacard relative'>
        <Link to='/admin/accepted'>
          <img className='absolute top-0 left-0 m-5' src={require('../../assets/backArrow.svg').default} alt='back-arrow' />
        </Link>
        <p className='bodytext md:font-20 font-16'>Make Real</p>
        <h1 style={{ wordBreak: 'break-word' }} className='font-bold'>{idea.title || <Skeleton className='w-100' />}</h1>
        <form className='mt-4 flex flex-column'>
          <label className='bodytext' htmlFor='gitlink-input'>
            Github Links
          </label>
          <input value={gitlinkInput} onKeyDown={(e) => { addGitlink(e) }} onChange={(e) => { setGitlinkInput(e.target.value) }} className='input z-1 block w-12' id='gitlink-input' />
          <div className='mb-4'>
            {gitlinks.map((gitlink, index) => {
              return (
                <span key={`gitlink${index}`} className='mt-1 comment flex justify-content-between align-items-center'>
                  <a style={{ wordBreak: 'break-word' }} className='block' href={gitlink}>{gitlink}</a>
                  <img onClick={() => { deleteGitlink(index) }} className='comment-delete' height={20} src={require('../../assets/trash-bin.svg').default} alt='trash' />
                </span>
              )
            })}
          </div>
          <label className='bodytext' htmlFor='deployedurls-input'>
            Deployed URLs
          </label>
          <input value={deployedURLsInput} onKeyDown={(e) => { addDeployedURL(e) }} onChange={(e) => { setDeployedURLsInput(e.target.value) }} className='input z-1 block w-12' id='deployedurls-input' />
          <div className='mb-4'>
            {deployedURLs.map((url, index) => {
              return (
                <span key={`deployed${index}`} className='mt-1 comment flex justify-content-between align-items-center'>
                  <a style={{ wordBreak: 'break-word' }} className='block' href={url}>{url}</a>
                  <img onClick={() => { deleteDeployedURL(index) }} className='comment-delete' height={20} src={require('../../assets/trash-bin.svg').default} alt='trash' />
                </span>
              )
            })}
          </div>
          <span className='flex align-items-center gap-2'>
            <label className='bodytext' htmlFor='madereal-input'>
              Made Real?
            </label>
            <Toggle
              id='madereal-input'
              checked={madeReal}
              onChange={(e) => { setMadeReal(!madeReal) }}
            />
          </span>
          <button onClick={(e) => submit(e)} type='button' className={(submitLoading ? 'disabled-button' : null) + ' primary-button mx-auto mt-5 font-16'}>Submit</button>
        </form>
      </div>
    </Layout>
  )
}
