import React from 'react'
import Grid from '@core/components/Grid'
import MainLayout from 'components/common/layout/MainLayout'

const Home = () => {
  return <Grid type="container" style={{ columnGap: '10%' }}></Grid>
}

Home.getLayout = (page: React.ReactNode) => <MainLayout>{page}</MainLayout>

export default Home
