import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Modal from 'react-modal'
import cls from 'classnames'
import { getYoutubeVideoById } from "../../lib/videos"
import Navbar from "../../components/navbar/navbar"
import Like from '../../components/icons/like-icon'
import Dislike from '../../components/icons/dislike-icon'
import styles from '../../styles/Video.module.css'

Modal.setAppElement('#__next')

export async function getStaticProps(context) {
  const videoId = context.params.videoId

  const videoArr = await getYoutubeVideoById(videoId)

  return {
    props: {
      video: videoArr.length > 0 ? videoArr[0] : {}
    },
    revalidate: 10
  }
}

export async function getStaticPaths() {
  const listOfVideos = ['mYfJxlgR2jw', '4zH5iYM4wJo', 'KCPEHsAViiQ']
  const paths = listOfVideos.map(videoId => ({
    params: { videoId }
  }))

  return {
    paths,
    fallback: 'blocking'
  }
}

const Video = ({ video }) => {
  const router = useRouter()

  const videoId = router.query.videoId

  const [toggleLike, setToggleLike] = useState(false)
  const [toggleDislike, setToggleDislike] = useState(false)

  const { title, publishTime, description, channelTitle, statistics: { viewCount } = { viewCount: 0 } } = video

  useEffect(() => {
    const getRatingInfo = async () => {
      const response = await fetch(`/api/stats?videoId=${videoId}`)
      const data = await response.json()
      if(data.length > 0) {
        const favorited = data[0].favorited
        if(favorited === 1) {
          setToggleLike(true)
        } else if(favorited === 0) {
          setToggleDislike(1)
        }
      }
    }
    getRatingInfo()
  }, [])

  const runRatingService = async favorited => {
    const response = await fetch('/api/stats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        videoId,
        favorited
      })
    })
  }

  const handleToggleLike = async () => {
    const val = !toggleLike
    setToggleLike(val)
    setToggleDislike(toggleLike)

    const favorited = val ? 1 : 0
    runRatingService(favorited)
  }

  const handleToggleDislike = async () => {
    const val = !toggleDislike
    setToggleDislike(val)
    setToggleLike(toggleDislike)

    const favorited = val ? 0 : 1
    runRatingService(favorited)  
  }

  return (
    <div className={styles.container}>
      <Navbar />
      <Modal
        isOpen={true}
        contentLabel='Watch the video'
        onRequestClose={() => router.back()}
        overlayClassName={styles.overlay}
        className={styles.modal}
      >
        <iframe
          className={styles.videoPlayer} 
          id='ytplayer'
          type='text/html'
          width='100%'
          height='360'
          src={`https://www.youtube.com/embed/${videoId}?autoplay=0&origin=http://example.com&controls=0&rel=1`}
          frameBorder='0'
        ></iframe>

        <div className={styles.likeDislikeBtnWrapper}>
            <div className={styles.likeBtnWrapper}>
              <button onClick={handleToggleLike}>
                <div className={styles.btnWrapper}>
                    <Like selected={toggleLike} />
                </div>
              </button>
            </div>
            <button onClick={handleToggleDislike}>
              <div className={styles.btnWrapper}>
                  <Dislike selected={toggleDislike} />
              </div>
            </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.modalBodyContent}>
            <div className={styles.col1}>
              <p className={styles.publishTime}>{publishTime}</p>
              <p className={styles.title}>{title}</p>
              <p className={styles.description}>{description}</p>
            </div>
            <div className={styles.col2}>
              <p className={cls(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>Cast: </span>
                <span className={styles.channelTitle}>{channelTitle}</span>
              </p>
              <p className={cls(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>View Count: </span>
                <span className={styles.channelTitle}>{viewCount}</span>
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Video