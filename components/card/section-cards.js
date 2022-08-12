import Link from 'next/link'
import Card from './card'
import cls from 'classnames'
import styles from './section-cards.module.css'

const SectionCards = ({ title, size, videos, shouldWrap = false, shouldScale }) => {
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={cls(styles.cardWrapper, shouldWrap && styles.wrap)}>
        {
          videos.map((video, index) => (
            <Link key={index} href={`/video/${video?.id}`}>
              <a>
                <Card id={index} imgUrl={video.imgUrl} size={size} shouldScale={shouldScale} />
              </a>
            </Link>
          ))
        }
      </div>
    </section>
  )
}

export default SectionCards