import Head from 'next/head'
import SectionCards from '../../components/card/section-cards'
import Navbar from '../../components/navbar/navbar'
import { verifyToken } from '../../lib/utils'
import { getMyList } from '../../lib/videos'
import styles from '../../styles/MyList.module.css'

export async function getServerSideProps(context) {
  const token = context.req ? context.req.cookies.token : null
  const userId = await verifyToken(token)

  if(!userId) {
    return {
      props: {},
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }

  const videos = await getMyList(userId, token)
  
  return {
    props: {
      myListVideos: videos
    }
  }
}

const MyList = ({ myListVideos }) => {
  return (
    <div>
      <Head>
        <title>My List</title>
      </Head>
      <main className={styles.main}>
        <Navbar />
        <div className={styles.sectionWrapper}>
          <SectionCards title='My List' videos={myListVideos} size='small' shouldWrap shouldScale={false} />
        </div>
      </main>
    </div>
  )
}

export default MyList