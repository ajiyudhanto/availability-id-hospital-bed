import React from 'react'
import Logo from './Logo'
import { Grid, Typography } from '@material-ui/core'

const Navbar = () => {

  return (
    <>
      <Grid container className='nav-container'>
        <Grid item container xs={1} sm={2} md={3} alignItems='center'>
          <Logo />
        </Grid>
        <Grid item container xs={11} sm={10} md={9} justify='flex-end' alignItems='center'>
          <div>
            <p className='rokkit nav-menu'>RS. Umum</p>
          </div>
          <div>
            <p className='rokkit nav-menu'>RS. Khusus</p>
          </div>
          <div>
            <p className='rokkit nav-menu'>Puskesmas</p>
          </div>
        </Grid>
      </Grid>
    </>
  )
}

export default Navbar