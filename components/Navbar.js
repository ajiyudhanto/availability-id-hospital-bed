import React, { useEffect, useState } from 'react'
import Logo from './Logo'
import { Grid, Typography, IconButton, Popper, Fade, ClickAwayListener, Paper } from '@material-ui/core'
import { useRouter } from 'next/router'
import MenuIcon from '@material-ui/icons/Menu';

const Navbar = () => {
  const router = useRouter()
  const [navbarWidth, setNavbarWidth] = useState(961)
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect( async () => {
    const _navbarWidth = document.getElementById('nav-bar').clientWidth
    setNavbarWidth(_navbarWidth)
  }, [])

  const handleBurgerClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((prev) => !prev);
  };

  return (
    <>
      <Grid container className='nav-container' id='nav-bar'>
        <Grid item container xs={10} sm={7} md={3} alignItems='center'>
          <Logo onClick={() => router.push('/')} style={{ cursor: 'pointer' }} />
        </Grid>
          <Popper open={open} anchorEl={anchorEl} placement={'bottom-end'} transition>
              {({ TransitionProps }) => (
                <ClickAwayListener onClickAway={() => setOpen(false)}>
                  <Fade {...TransitionProps} timeout={350}>
                    <Paper className='paper-menu'>
                      <p onClick={() => router.push('/covid')} className='rokkit nav-menu-paper'>RS Bed Khusus Covid</p>
                      <p onClick={() => router.push('/non-covid')} className='rokkit nav-menu-paper'>RS Bed Khusus Non-Covid</p>
                      <p onClick={() => router.push('/disclaimer')} className='rokkit nav-menu-paper'>Disclaimer</p>
                    </Paper>
                  </Fade>
                </ClickAwayListener>
              )}
          </Popper>
        <Grid item container xs={2} sm={5} md={9} justifyContent='flex-end' alignItems='center'>
          {
            navbarWidth < 960 ? 
              <IconButton onClick={handleBurgerClick}>
                <MenuIcon style={{ color: '#01C5B8' }} />
              </IconButton> :
              <>
                <div className='nav-menu-container'>
                  <p onClick={() => router.push('/covid')} className={`rokkit nav-menu ${router.pathname === '/covid' ? 'nav-selected' : ''}`}>RS Bed Khusus Covid</p>
                </div>
                <div className='nav-menu-container'>
                  <p onClick={() => router.push('/non-covid')} className={`rokkit nav-menu ${router.pathname === '/non-covid' ? 'nav-selected' : ''}`}>RS Bed Khusus Non-Covid</p>
                </div>
                <div className='nav-menu-container'>
                  <p onClick={() => router.push('/disclaimer')} className={`rokkit nav-menu ${router.pathname === '/disclaimer' ? 'nav-selected' : ''}`}>Disclaimer</p>
                </div>
              </>
          }
        </Grid>
      </Grid>
    </>
  )
}

export default Navbar