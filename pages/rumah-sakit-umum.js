import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'
import dynamic from 'next/dynamic'
import { Grid, FormControl, InputLabel, NativeSelect } from '@material-ui/core'

const Map = dynamic(import('../components/Map.js'), {
  ssr: false
})


export default function RSU() {
  const router = useRouter()
  const [hospitalData, setHospitalData] = useState([])

  useEffect(async () => {
    try {
      const res = await fetch('http://api.jakarta.go.id/v1/rumahsakitumum/', {
        method: 'GET',
        mode: 'cors',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'PqUuY7UOngNf6egmf9ikkpCrvkqgyv+4eW1r0I0tZo/bWhH9N2eBN6KHzTmsg6WG'
        }
      })
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }, [])

  return (
    <div>
      <Head>
        <title>Jakarta Hospital Data</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/Hospital.svg" />
      </Head>

      <main className='main-container'>
        <Navbar />
        <Map data={[1,2,3]} />
      </main>
    </div>
  )
}