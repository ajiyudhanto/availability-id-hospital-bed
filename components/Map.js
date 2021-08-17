import React, { useEffect, useState } from 'react'
import Script from 'next/script'
import Head from 'next/head'
import { Grid } from '@material-ui/core'
import { MapContainer, TileLayer, Marker, Popup, Circle, CircleMarker } from 'react-leaflet'

export default function Map({ data, centerPosition, getHospitalDetails }) {
  const [refresh, setRefresh] = useState(true)

  useEffect(() => {
    if (!data.length) return
    setRefresh(false)
    setTimeout(() => setRefresh(true), 1000)
  }, [data, centerPosition])

  function parseDMS(input) {
    var parts = input.split(/[^\d\w\.]+/);
    var lat = convertDMSToDD(parts[0], parts[1], parts[2], parts[3]);
    var lng = convertDMSToDD(parts[4], parts[5], parts[6], parts[7]);
    return { lat, lng }
  }

  function convertDMSToDD(degrees, minutes, seconds, direction) {
    var dd = Number(degrees) + Number(minutes)/60 + Number(seconds)/(60*60);

    if (direction == "S" || direction == "W") {
        dd = dd * -1;
    } // Don't do anything for N or E
    return dd;
  }

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
          integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
          crossOrigin=''
        />
        <Script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
          integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=="
          crossOrigin=''
        />
      </Head>

      <Grid container className='primal-container'>
        {
          data && refresh && centerPosition && <MapContainer center={centerPosition} zoom={data.length ? 12 : 5} scrollWheelZoom={true} className='map-container'>
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {
              data.length && data.map(e => {
                if (!Number(e.lat)) {
                  const { lat, lng } = parseDMS(e.lat + ' ' + e.long)
                  e.lat = lat
                  e.long = lng
                }
                if (e.lat.includes(',')) {
                  e.lat = e.lat.split(',')[0]
                } 
                if (e.long.includes(',')) {
                  e.long = e.long.split(',')[0]
                }
                return (
                  <Marker position={[e.lat, e.long]} key={e.id}>
                    <Popup>
                      Nama: {e.name} <br/>
                      Kasur yang tersedia: {e.bed_availability} buah <br/>
                      <button onClick={() => getHospitalDetails(e.id)}>detail</button>
                    </Popup>
                  </Marker>
                )
              })
            }
          </MapContainer>
        }
      </Grid>
    </>
  )
}