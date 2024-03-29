/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState, useRef } from 'react'
import axios from '../../axios'
import dayjs from 'dayjs'
import IdeaCard from '../../components/IdeaCard'
import { useSelector, useDispatch } from 'react-redux'
import { MixedTags } from '@yaireo/tagify/dist/react.tagify'
import Skeleton from 'react-loading-skeleton'
import styles from './ideas.css'
import { Link } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { setStatus } from '../../app/slices/notifSlice'
import Layout from '../../components/Layout'

export default function Ideas () {
  const dispatch = useDispatch()
  const [ideas, setIdeas] = useState([])
  const [limitCount, setLimitCount] = useState(12)
  const [moreLoading, setMoreLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [userList, setUserList] = useState([])
  const [userStrings, setUserStrings] = useState([])
  const [tagStrings, setTagStrings] = useState([])
  const [sort, setSort] = useState('')
  const [order, setOrder] = useState('')
  const [fromDate, setFromDate] = useState()
  const [toDate, setToDate] = useState()
  const [ideasloading, setIdeasloading] = useState(true)
  const [tagSettings, setTagSettings] = useState({
    pattern: /@|#/,
    dropdown: {
      enabled: 1,
      position: 'text'
    },
    backspace: true,
    templates: {
      tag (tagData, tagify) {
        return `<tag title="${(tagData.title || tagData.value)}"
                contenteditable='false'
                spellcheck='false'
                tabIndex="${this.settings.a11y.focusableTags ? 0 : -1}"
                class="${this.settings.classNames.tag} ${tagData.class ? tagData.class : ''}"
                ${this.getAttributes(tagData)} style="--tag-bg:${getColor(tagData)}">
        <x title='' class="${this.settings.classNames.tagX}" role='button' aria-label='remove tag'></x>
        <div>
            <span class="${this.settings.classNames.tagText}">${tagData[this.settings.tagTextProp] || tagData.value}</span>
        </div>
      </tag>`
      }
    }
  })

  const getColor = (tagData) => {
    if (tagData.prefix === '@') {
      return '#4799d3'
    } else if (tagData.prefix === '#') {
      return '#65d34c'
    }
  }
  const [user, setUser] = useState('')
  const [tags, setTags] = useState([])
  const [ideaCount, setIdeaCount] = useState(0)

  const tagifyRef = useRef()

  const auth = useSelector(state => state.auth)
  const authRef = useRef(auth)

  useEffect(() => {
    const getNotifs = () => {
      axios.get('/notifications', {
        headers: {
          authorization: auth.token
        }
      }).then(res => {
        dispatch(setStatus(res.data.notifications.notifications.some(notif => !notif.read)))
      })
    }
    if (auth.token) {
      getNotifs()
    }
  }, [auth, dispatch])

  useEffect(() => {
    document.getElementsByClassName('tagify__input')[0].addEventListener('keydown', (e) => {
      if (e.keyCode === 13 && !e.shiftKey) {
        e.preventDefault()
        return false
      }
    })

    document.getElementsByClassName('tagify')[0].style.borderRadius = '18px'
    document.getElementsByClassName('tagify')[0].style.paddingLeft = '1rem'
  }, [])

  useEffect(() => {
    const fetchIdeas = async () => {
      await axios
        .get('/ideas', {
          params: {
            limit: 12
          }
        }
        )
        .then(res => {
          setIdeas(res.data.ideas.sort(function (a, b) {
            return new Date(b.createdOn) - new Date(a.createdOn)
          }))
          setIdeasloading(false)
        })
    }
    const fetchUsers = async () => {
      await axios
        .get('/user')
        .then(res => {
          setUserList(res.data.users)
          setUserStrings(res.data.users.map(a => a.name))
        })
    }
    const getIdeaCount = () => {
      axios.get(`/user/${auth._id}`, {
        headers: {
          authorization: auth.token
        }
      }).then(res => {
        setIdeaCount(res.data.noOfIdeas)
      })
    }
    if (auth.token) {
      authRef.current = auth
      getIdeaCount()
    }
    fetchIdeas()
    fetchUsers()
  }, [auth])

  const searchIdeas = (e, limit) => {
    e.preventDefault()

    setUser(user => {
      setFromDate(from => {
        setToDate(to => {
          setTags(tags => {
            setSearch(async search => {
              if (tags.length) {
                for (let i = 0; i < tags.length; i++) {
                  search = search.replace(tags[i], '')
                }
              }
              if (user) search = search.replace(user, '')
              await axios.get('/ideas', {
                headers: {
                  authorization: authRef.current.token
                },
                params: {
                  endDate: to,
                  startDate: from,
                  user,
                  query: search,
                  tags: tags.join(),
                  limit
                }
              }).then(res => {
                if (!res.data.results) {
                  setIdeas(res.data.ideas.sort(function (a, b) {
                    return new Date(b.createdOn) - new Date(a.createdOn)
                  }))
                } else {
                  // const arr = res.data.searchResults
                  let arr = res.data.results.sort(function (a, b) {
                    return b.score - a.score
                  })
                  arr = arr.map((idea, index) => {
                    return idea.idea
                  })
                  // console.log(res.data.results)
                  // console.log(arr)
                  setIdeas(arr)
                }
              }).then(() => {
                setIdeasloading(false)
                setMoreLoading(false)
                setSearch(search)
              })
            })
            return tags
          })
          return to
        })
        return from
      })
      return user
    })
  }

  const onInput = (e) => {
    const prefix = e.detail.prefix

    if (prefix) {
      if (prefix === '@') {
        setUserStrings(state => {
          tagifyRef.current.whitelist = state
          return state
        })
      }

      if (prefix === '#') {
        setTagStrings(state => {
          tagifyRef.current.whitelist = state
          return state
        })
      }
    } else {
      setSearch(e.detail.textContent)
    }
  }

  const onChange = useCallback(e => {
    if (e.detail.tagify.value[e.detail.tagify.value.length - 1].prefix === '@') {
      setUser(e.detail.tagify.value[e.detail.tagify.value.length - 1].value)
    } else if (e.detail.tagify.value[e.detail.tagify.value.length - 1].prefix === '#') {
      setTags(e.detail.tagify.value.filter(tag => {
        return tag.prefix === '#'
      }).map(tag => {
        return tag.value
      }))
    }
  }, [])

  const onRemove = useCallback(e => {
    setTags(tags => {
      if (tags && tags.length) {
        for (let i = 0; i < tags.length; i++) {
          setSearch(search => search.replace(tags[i], ''))
        }
      }
      return tags
    })
    setUser(user => {
      if (user) setSearch(search => search.replace(user, ''))
      return user
    })
    if (e.detail.data.prefix === '@') {
      setUser('')
    } else if (e.detail.data.prefix === '#') {
      setTags(tags.filter((tag) => tag !== e.detail.data.value))
    }
  }, [])

  return (
    <Layout>
      <div className='negmar-ideas grid md:gap-4 gap-2'>
        <div className='col-12 md:col flex flex-column md:gap-3 gap-4'>
          <div className={`${auth.token ? 'top-3' : 'top-2'} searchbg z-2 sticky`}>
            <div className='align-items-center relative w-full flex gap-3 flex-row'>
              <form className='relative flex-grow-1 flex flex-row gap-4'>
                {auth.token
                  ? (
                    <Link
                      className='sm:flex hidden' to='/ideas/new' state={{
                        toPrevious: true
                      }}
                    >
                      <div className='flex flex-column m-auto'>
                        <p className='bodytext font-16'>You have</p>
                        <p className='m-auto md:font-24 font-16'><span className='md:font-24 font-20 blue font-bold'>{ideaCount}</span> idea{ideaCount !== 1 ? 's' : null}</p>
                      </div>
                    </Link>
                    )
                  : null}
                <div className='relative flex-grow-1'>
                  <MixedTags
                    autoFocus
                    id='area'
                    settings={tagSettings}
                    onInput={onInput}
                    onChange={onChange}
                    placeholder='hint: type @ or #'
                    styles={{ borderRadius: '18px' }}
                    tagifyRef={tagifyRef}
                    className='radius'
                    onRemove={onRemove}
                  />
                  <button
                    onClick={e => {
                      e.preventDefault()
                      setIdeasloading(true); setLimitCount(12); searchIdeas(e, 12)
                    }} className='button absolute top-0 bottom-0 right-0 flex flex-row align-items-center gap-2 primary-button-green'
                  >
                    <p className='font-16'>Search</p>
                    <img className='h-1rem' src={require('../../assets/searchglass.svg').default} alt='searchglass' />
                  </button>
                </div>
              </form>
            </div>
            <div className='mt-3 flex flex-row sm:gap-4 gap-2 md:justify-content-end justify-content-center flex-wrap'>
              <span className='flex flex-row'>
                <label className='mr-2' htmlFor='date-from'>From</label>
                <DatePicker selected={fromDate} dateFormat='yyyy/MM/dd' onChange={(date) => { setFromDate(date) }} name='date-from' id='date-from' excludeDateIntervals={toDate ? [{ start: toDate, end: new Date(Date.now() + 10000000000) }] : null} placeholderText='YYYY/MM/DD' className='date-picker' />
              </span>
              <span className='flex flex-row'>
                <label className='mr-2' htmlFor='date-to'>To</label>
                <DatePicker dateFormat='yyyy/MM/dd' selected={toDate} onChange={(date) => { setToDate(date) }} name='date-to' className='date-picker' excludeDateIntervals={fromDate ? [{ start: new Date(0), end: fromDate }] : null} placeholderText='YYYY/MM/DD' id='date-to' />
              </span>
            </div>
          </div>
          {!ideasloading
            ? (
              <div className='ideagrid gap-5'>
                {ideas.length
                  ? (ideas.map((idea, index) => {
                      return <IdeaCard key={index} name={idea ? idea.title : null} description={idea ? idea.description : null} authorId={idea ? idea.author._id : null} ideaspage author={idea ? idea.author._id === auth._id ? 'You' : idea.authorName : null} tags={idea ? idea.tags : []} date={idea ? idea.createdOn : null} ideaId={idea ? idea._id : null} hearted={idea ? idea.upvotes.includes(auth._id) : []} upvoteCount={idea ? idea.upvotes.length : null} completed={idea ? idea.madeReal : null} unapproved={idea ? idea.status !== 'approved' : null} rejected={idea ? idea.status === 'rejected' : null} />
                    }))
                  : <p className='text-center bodytext mt-4'>No ideas found 😔</p>}
              </div>
              )
            : <Skeleton containerClassName='flex flex-column gap-2' className='border-round-xl' height={200} count={50} />}
          {limitCount <= ideas.length
            ? (
              <button
                onClick={async (e) => {
                  e.preventDefault()
                  setMoreLoading(true)
                  searchIdeas(e, limitCount + 12)
                  setLimitCount(limitCount + 12)
                }} className='button primary-button font-16 mx-auto mt-4 text-center'
              >Load more...
              </button>
              )
            : moreLoading ? <button disabled className=' font-16 mx-auto disabled-button primary-button mt-4 text-center'>Fetching...</button> : <p className='mt-4 blue text-center'>You've reached the end.</p>}
        </div>
      </div>
    </Layout>
  )
}
/* eslint-enable no-unused-vars */
