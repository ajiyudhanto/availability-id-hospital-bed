import React, { useEffect, useState } from 'react'
import Logo from './Logo'
import { Grid, Typography } from '@material-ui/core'
import { useRouter } from 'next/router'

const Navbar = () => {
  const router = useRouter()
  const [urlNow, setUrlNow] = useState('')

  useEffect(() => {
    if (router.pathname) {
      setUrlNow(router.pathname)
    }
  }, [router])

  return (
    <>
      <Grid container className='nav-container'>
        <Grid item container xs={1} sm={2} md={3} alignItems='center'>
          <Logo onClick={() => router.push('/')} style={{ cursor: 'pointer' }} />
        </Grid>
        <Grid item container xs={11} sm={10} md={9} justifyContent='flex-end' alignItems='center'>
          <div className='nav-menu-container'>
            <p onClick={() => router.push('/rumah-sakit-umum')} className={`rokkit nav-menu ${router.pathname === '/rumah-sakit-umum' ? 'nav-selected' : ''}`}>RS. Umum</p>
          </div>
          <div className='nav-menu-container'>
            <p onClick={() => router.push('/rumah-sakit-khusus')} className={`rokkit nav-menu ${router.pathname === '/rumah-sakit-khusus' ? 'nav-selected' : ''}`}>RS. Khusus</p>
          </div>
          <div className='nav-menu-container'>
            <p onClick={() => router.push('/puskesmas')} className={`rokkit nav-menu ${router.pathname === '/puskesmas' ? 'nav-selected' : ''}`}>Puskesmas</p>
          </div>
        </Grid>
      </Grid>
    </>
  )
}

export default Navbar