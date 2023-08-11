import Button from '@core/components/Button'
import Dropdown from '@core/components/Dropdown'
import Grid from '@core/components/Grid'
import Input from '@core/components/Input'
import Typography from '@core/components/Typography'
import { SearchMarkSvg } from '@core/icons'
import React from 'react'

/**
 *
 */
const ItemInfo = () => {
  return (
    <Grid type="container">
      <Grid type="item" style={{ marginTop: '20px' }}>
        <Grid type="container">
          <Grid type="item" area={12}>
            <Typography style={{ fontWeight: '500' }}>아이템 정보</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid type="item">
        <Grid type="container" horizen="center">
          <Grid type="item" area={8}>
            <Grid type="container">
              <Grid type="item" area={11} horizen="center" align="center">
                <Dropdown></Dropdown>
              </Grid>
              <Grid type="item" area={1} />
              <Grid type="item" area={11} horizen="center" align="center">
                <Dropdown></Dropdown>
              </Grid>
            </Grid>
          </Grid>
          <Grid type="item" area={14}>
            <Grid type="container" align="center">
              <Grid type="item" area={5} horizen="center" align="center">
                <Dropdown></Dropdown>
              </Grid>
              <Grid type="item" area={15} horizen="center" align="center">
                <Input />
              </Grid>
            </Grid>
          </Grid>
          <Grid type="item" area={2} align="right">
            <Button afterTagNode={SearchMarkSvg}>검색</Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default ItemInfo
