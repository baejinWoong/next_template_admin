import React from 'react'

import Modal from '@core/modal'
import Card from '@core/components/Card'
import Grid from '@core/components/Grid'
import Button from '@core/components/Button'
import Typography from '@core/components/Typography'

// recoil Import
import { useRecoilState } from 'recoil'
import { alertModalRecoil } from '../../recoil/atom'
import { alertModalState } from 'recoil/defaultValue'

const AlertModal = () => {
  const [alertState, setAlertState] = useRecoilState(alertModalRecoil)

  const closeAlertHaendler = () => {
    alertState.clickButtonCallback?.()
    setAlertState(alertModalState)
  }

  return (
    <Modal open={alertState.isOpen}>
      <Card type={2} style={{ minWidth: '20vw', left: '37%', top: '35%', outline: 'none' }}>
        <Grid type="container">
          <Grid type="item" style={{ padding: '20px' }} align="center">
            <Typography fontSize="body1" style={{ whiteSpace: 'pre-line' }}>
              {alertState.alertText}
            </Typography>
          </Grid>
          <Grid type="item">
            <Grid type="container" align="center">
              <Button size="small" onClick={closeAlertHaendler} style={{ width: '120px' }}>
                확인
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </Modal>
  )
}

export default AlertModal
