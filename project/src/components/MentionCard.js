import React from 'react'

export default function MentionCard({author, date, name='Default', pfp, commentAuthor='ComAuth', commentBody='howdy',_id, ideaId, readStatus}) {

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

  return (
    <div className={`flex-grow-1 border-round-xl ${!readStatus ? 'bg-white': null} ideacard relative flex flex-row`}>
      {!readStatus ? <img className='absolute top-0 left-0 py-2 px-2' src={require('../assets/unreadCircle.svg').default} alt='unread'/> : null}
      <div className='py-4 px-5 sm:flex flex-column hidden col-5 border-right'>
        <div className='bodytext grid px-2 pt-1 font-16 gap-1 align-items-center mb-3'>
          <p>{author}</p>
          <p className='md:block hidden'>|</p>
          <p className='font-16 datetext'>{date}</p>
        </div>
        <p className='font-20 g-med'>{name}</p>
      </div>
      <div className='py-4 px-5 sm:col-7 col-12 flex'>
        <div className='flex flex-row md:gap-4 gap-3 my-auto'>
          <img className='w-3rem pfp' src={pfp} alt='pfp' referrerPolicy='no-referrer' />
          <div className='flex-grow-1'>
            <p className='md:font-20 font-16'>{commentAuthor}</p>
            <span className='mt-1 bodytext font-16' dangerouslySetInnerHTML={{__html:doRegex(commentBody)}}></span>
          </div>
        </div>
      </div>
    </div>
  )
}
