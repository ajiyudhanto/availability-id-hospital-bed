import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'
import dynamic from 'next/dynamic'
import { Grid, Card, CardActions, CardContent, CircularProgress } from '@material-ui/core'

const Map = dynamic(import('../components/Map.js'), {
  ssr: false
})


export default function Covid() {
  const router = useRouter()
  const [provinces, setProvices] = useState([])
  const [selectedProvince, setSelectedProvince] = useState('')
  const [cities, setCities] = useState([])
  const [selectedCity, setSelectedCity] = useState('')
  const [isLoadingCities, setIsLoadingCities] = useState(false)
  const [hospitals, setHospitals] = useState([])
  const [isLoadingHospitals, setIsLoadingHospitals] = useState(false)
  const [totalHospitals, setTotalHospitals] = useState(100)
  const [totalLoadedHospitals, setTotalLoadedHospitals] = useState(0)
  const [selectedHospital, setSelectedHospital] = useState({})
  const [mapCenter, setMapCenter] = useState([0.3737, 127.1902])

  useEffect(async () => {
    try {
      const res = await fetch('https://rs-bed-covid-api.vercel.app/api/get-provinces', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      const data = await res.json()
      setProvices(data.provinces)
    } catch (error) {
      console.log(error)
    }
  }, [])

  const handleChangeProvince = (event) => {
    setCities([])
    setSelectedProvince(event.target.value)
  }

  const handleChangeCity = (event) => {
    setHospitals([])
    setSelectedCity(event.target.value)
  }

  useEffect(async () => {
    try {
      if (!selectedProvince) {
        setCities([])
        setSelectedCity('')
        return
      }
      setIsLoadingCities(true)
      const res = await fetch(`https://rs-bed-covid-api.vercel.app/api/get-cities?provinceid=${selectedProvince}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      const data = await res.json()
      setCities(data.cities)
      setIsLoadingCities(false)
    } catch (error) {
      console.log(error)
    }
  }, [selectedProvince])

  useEffect(async () => {
    try {
      if (!selectedCity) {
        setHospitals([])
        setSelectedHospital({})
        return
      }
      setTotalHospitals(100)
      setTotalLoadedHospitals(0)
      setIsLoadingHospitals(true)
      const res = await fetch(`https://rs-bed-covid-api.vercel.app/api/get-hospitals?provinceid=${selectedProvince}&cityid=${selectedCity}&type=1`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      const data = await res.json()
      setTotalHospitals(data.hospitals.length)
      const _hospitals = []
      for (let i = 0; i < data.hospitals.length; i++) {
        const rs = await fetch(`https://rs-bed-covid-api.vercel.app/api/get-hospital-map?hospitalid=${data.hospitals[i].id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        })
        const _data = await rs.json()
        if (i === 0) setMapCenter([Number( _data.data.lat), Number(_data.data.long)])
        _hospitals.push({ ...data.hospitals[i], lat: _data.data.lat, long: _data.data.long })
        setTotalLoadedHospitals(i + 1)
      }
      setHospitals(_hospitals)
      setIsLoadingHospitals(false)
    } catch (error) {
      console.log(error)
    }
  }, [selectedCity])

  const getHospitalDetails = async (id) => {
    try {
      const res = await fetch(`https://rs-bed-covid-api.vercel.app/api/get-bed-detail?hospitalid=${id}&type=1`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      const data = await res.json()
      setSelectedHospital(data.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const detailsContainer = document.getElementById('hospital-details-grid')
    if (detailsContainer) {
      detailsContainer.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
    }
  }, [selectedHospital])

  return (
    <div>
      <Head>
        <title>Jakarta Hospital Data</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/Hospital.svg" />
      </Head>

      <main className='main-container'>
        <Navbar />
        <Grid container className='primal-container'>
          <select
            value={selectedProvince}
            onChange={handleChangeProvince}
            className='region-selection top-selection rokkit'
          >
            <option value={''} className='select-option'>Pilih Provinsi</option>
            {
              provinces.length && provinces.map(e => {

                return (
                  <React.Fragment key={e.id}>
                    <option value={e.id} className='select-option'>{ e.name }</option>
                  </React.Fragment>
                )
              }) 
            }
          </select>
          <select
            value={selectedCity}
            onChange={handleChangeCity}
            className='region-selection rokkit'
            disabled={ cities.length ? false : true }
          >
            <option value={''} className='select-option'>Pilih Kota atau Kabupaten</option>
            {
              cities.length && cities.map(e => {

                return (
                  <React.Fragment key={e.id}>
                    <option value={ e.id } className='select-option'>{ e.name }</option>
                  </React.Fragment>
                )
              })
            }
          </select>
          {
            isLoadingCities && <CircularProgress className='rokkin loading-cities' style={{ color: '#01C5B8' }} />
          }
        </Grid>
        <Map 
          data={hospitals}
          centerPosition={mapCenter}
          getHospitalDetails={getHospitalDetails}
          isLoadingHospitals={isLoadingHospitals}
          totalHospitals={totalHospitals}
          totalLoadedHospitals={totalLoadedHospitals}
        />
        {
          selectedHospital.id && <Grid container id='hospital-details-grid' className='primal-container' direction='column'>
            <h1 className='rokkit hospital-title'>{ selectedHospital.name }</h1>
            <h2 className='rokkit hospital-subtitle'>{ selectedHospital.address }</h2>
            <h2 className='rokkit hospital-subtitle'>Kontak : { selectedHospital.phone ? selectedHospital.phone : '-' }</h2>
            <h1 className='rokkit hospital-title' style={{ marginTop: 30, marginBottom: 15 }}>Detail Tempat Tidur</h1>
            <Grid container item xs={12} style={{ width: '100%' }}>
              {
                selectedHospital.bedDetail.length && selectedHospital.bedDetail.map(e => {
                  return (
                    <Card className={ !Number(e.stats.bed_empty) ? 'empty-bed-card-container' : 'bed-card-container' } key={e.stats.title}>
                      <CardContent className='card-details-container'>
                        <p className='rokkit bed-card-title'>{ e.stats.title }</p>
                        <p className='rokkit bed-card-content'>Jumlah tempat tidur: { e.stats.bed_available }</p>
                        <p className='rokkit bed-card-content'>Tempat tidur kosong: { e.stats.bed_empty }</p>
                        <p className='rokkit bed-card-content'>Antrean: { e.stats.queue }</p>
                      </CardContent>
                      <CardActions style={{ justifyContent: 'flex-end' }}>
                        <p className='rokkit bed-card-content'>{ e.time }</p>
                      </CardActions>
                    </Card>
                  )
                })
              }
            </Grid>
          </Grid>
        }
      </main>
    </div>
  )
}
