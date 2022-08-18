import React, { useCallback, useEffect, useState, useRef } from 'react'
import axios from '../../axios'
import IdeaCard from '../../components/IdeaCard'
import { useSelector } from 'react-redux'
import { MixedTags } from '@yaireo/tagify/dist/react.tagify'
import Skeleton from 'react-loading-skeleton'
import styles from './ideas.css'

export default function Ideas () {
  const [ideas, setIdeas] = useState([])
  const [search, setSearch] = useState('')
  const [userList, setUserList] = useState([])
  const [userStrings, setUserStrings] = useState([])
  const [tagStrings, setTagStrings] = useState([])
  const [sort, setSort] = useState('')
  const [order, setOrder] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [tagSettings, setTagSettings] = useState({
    pattern: /@|#/,
    dropdown: {
      enabled: 1,
      position: 'text'
    },
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
  const [tags, setTags] = useState()

  const tagifyRef = useRef()

  const auth = useSelector(state => state.auth)
  const authRef = useRef(auth)

  useEffect(() => {
    const fetchIdeas = async () => {
      await axios
        .get('/ideas', {
          headers: {
            authorization: auth.token
          }
        })
        .then(res => {
          setIdeas(res.data.ideas)
        })
    }
    const fetchUsers = async () => {
      await axios
        .get('/user', {
          headers: {
            authorization: auth.token
          }
        })
        .then(res => {
          setUserList(res.data.users)
          setUserStrings(res.data.users.map(a => a.name))
        })
    }
    if (auth.token) {
      authRef.current = auth
      fetchIdeas()
      fetchUsers()
      document.getElementById('mainpfp').src = auth.picture
    }
  }, [auth])

  const searchIdeas = (e, userName, authState) => {
    e.preventDefault()
    if (e.detail.originalEvent.key === 'Enter') {
      setUser(user => {
        setOrder(order => {
          setSort(sort => {
            setSearch(async search => {
              await axios.get('/ideas', {
                headers: {
                  authorization: authRef.current.token
                },
                params: {
                  order,
                  sortBy: sort,
                  user: user,
                  query: search
                }
              }).then(res => setIdeas(res.data.ideas))
            })
          })
        })
      })
    }  
  }

  const onInput = (e) => {
    console.log(e)
    setSearch(e.detail.textContent)
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
    }
  }

  const onChange = useCallback(e => {
    console.log(e.detail)
    console.log(e.detail.value)
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

  return (
    <div className='grid gap-4'>
      <div className='h-min md:sticky top-0 xl:col-4 md:col-5 col-12'>
        {auth.token ? 
        <div className='flex-grow-1 flex flex-row border-round-xl p-3 bg-white ideacard align-items-center gap-3 mb-6'>
          {auth.picture && <img className='pfp' id='mainpfp' width={60} alt='pfp' src={auth.picture} referrerPolicy='no-referrer' />}
          <p>{auth.name}</p>
        </div>
        : null}
        <div className={`border-round-xl p-3 bg-white ideacard md:block ${showFilters ? 'block' : 'hidden'} filterDiv`}>
          <div className='flex flex-column gap-2 mb-4'>
            <p className='font-20'>Sort By:</p>
            <label>
              <input
                type='radio'
                value='hearts'
                checked={sort === 'hearts'}
                className='form-check-input'
                onChange={e => setSort(e.target.value)}
              />
              Hearts
            </label>
            <label>
              <input
                type='radio'
                value='date'
                checked={sort === 'date'}
                className='form-check-input'
                onChange={e => setSort(e.target.value)}
              />
              Date
            </label>
          </div>
          <div className='flex flex-column gap-2'>
            <p className='font-20'>Order:</p>
            <label>
              <input
                type='radio'
                value='asc'
                checked={order === 'asc'}
                className='form-check-input'
                onChange={e => setOrder(e.target.value)}
              />
              Ascending
            </label>
            <label>
              <input
                type='radio'
                value='desc'
                checked={order === 'desc'}
                className='form-check-input'
                onChange={e => setOrder(e.target.value)}
              />
              Descending
            </label>
          </div>
        </div>
      </div>
      <div className='col-12 md:col flex flex-column gap-6'>
        <div className='align-items-center relative w-full flex gap-4 flex-row'>
          <form className='relative flex-grow-1'>
            <MixedTags
              autoFocus
              settings={tagSettings}
              onInput={onInput}
              onChange={onChange}
              placeholder='hint: type @ or #'
              tagifyRef={tagifyRef}
              className={styles.tagify}
              onKeydown={(e) => searchIdeas(e, user, auth)}
            />
            <img className='absolute top-0 bottom-0 left-0 ml-3 my-auto' src={require('../../assets/searchglass.svg').default} alt='searchglass' />
            <img onClick={() => setShowFilters(!showFilters)} className='absolute top-0 bottom-0 right-0 mr-3 my-auto md:hidden block' src={require('../../assets/filter-icon.png')} alt='filter' />
          </form>
        </div>
        <div className='flex flex-column gap-5'>
          {ideas.length ? ideas.map((idea, index) => {
            return <IdeaCard key={index} name={idea.title} description={idea.description} author={idea.author === auth._id ? 'You' : idea.authorName} tags={idea.tags} date={idea.createdOn} ideaId={idea._id} hearted={idea.upvotes.includes(auth._id)} upvoteCount={idea.upvotes.length} />
          })
          : <Skeleton height={10} count={50}/>}
        </div>
      </div>
    </div>
  )
}
