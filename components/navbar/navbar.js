import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import styles from './navbar.module.css'
import { magic } from '../../lib/magic-client'

const Navbar = () => {
  const router = useRouter()

  const [showDropdown, setShowDropdown] = useState(false)
  const [username, setUsername] = useState('')
  const [didToken, setDidToken] = useState('')

  useEffect(() => {
    const getUsername = async () => {
      try {
        const { email, issuer } = await magic.user.getMetadata()
        const didToken = await magic.user.getIdToken()
        console.log({ didToken })
        if(email) {
          setUsername(email)
        }
      } catch (error) {
        console.error('Error retrieving email', error)
      }
    }

    getUsername()
  }, [])

  const handleOnClickHome = e => {
    e.preventDefault()
    router.push('/')
  }

  const handleOnClickMyList = e => {
    e.preventDefault()
    router.push('/browse/my-list')
  }

  const handleShowDropdown = e => {
    e.preventDefault()
    setShowDropdown(prevState => !prevState)
  }

  const handleSignout = async e => {
    e.preventDefault()
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${didToken}`,
          "Content-Type": "application/json",
        },
      });

      const res = await response.json();
    } catch (error) {
      console.error('Error logging out', error)
      router.push('/login')
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Link className={styles.logoLink} href="/">
            <a>
              <div className={styles.logoWrapper}>
                <Image
                  src="/static/netflix.svg"
                  alt="Netflix logo"
                  width="128px"
                  height="34px"
                />
              </div>
            </a>
          </Link>
        <ul className={styles.navItems}>
          <li onClick={handleOnClickHome} className={styles.navItem}>Home</li>
          <li onClick={handleOnClickMyList} className={styles.navItem2}>My List</li>
        </ul>
        <nav className={styles.navContainer}>
          <div>
            <button onClick={handleShowDropdown} className={styles.username}>
              <p>{username}</p>
              <Image src='/static/expand_more.svg' alt='Expand dropdown' width='24px' height='24px' />
            </button>

            {showDropdown && (
              <div className={styles.navDropdown}>
                <div>
                  <a onClick={handleSignout} className={styles.linkName}>Sign Out</a>
                  <div className={styles.lineWrapper}></div>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  )
}

export default Navbar