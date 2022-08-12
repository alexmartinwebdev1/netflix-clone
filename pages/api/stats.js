import jwt from 'jsonwebtoken'
import { findVideoIdByUser, insertStats, updateStats } from '../../lib/db/hasura'

export default async function stats(req, res) {
  if(req.method === 'POST') {
    try {
      const token = req.cookies.token
      if(!token) {
        res.status(403).send({})
      } else {
        const { videoId, favorited, watched = true } = req.body
        
        if(videoId) {
          const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
          const userId = decodedToken.issuer
          const findVideo = await findVideoIdByUser(token, userId, videoId)
          const doStatsExist = findVideo?.length > 0
          if(doStatsExist) {
            const response = await updateStats(token, {
              watched,
              userId,
              videoId,
              favorited
            })
            res.send({ response })
          } else {
            const response = await insertStats(token, {
              watched,
              userId,
              videoId,
              favorited
            })
            res.send({ response })
          }
        }
      }
    } catch (error) {
      console.error('Error occured /stats', error)
      res.status(500).send({ done: false, error: error?.message })
    }
  } else {
    try {
      const token = req.cookies.token
      if(!token) {
        res.status(403).send({})
      } else {
        const { videoId } = req.query
        
        if(videoId) {
          const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
          const userId = decodedToken.issuer
          const findVideo = await findVideoIdByUser(token, userId, videoId)
          const doStatsExist = findVideo?.length > 0
          if(doStatsExist) {
            res.send(findVideo)
          } else {
            res.status(404)
            res.send({ user: null, msg: 'Video not found' })
          }
        }
      }
    } catch (error) {
      console.error('Error occured /stats', error)
      res.status(500).send({ done: false, error: error?.message })
    }
  }
}