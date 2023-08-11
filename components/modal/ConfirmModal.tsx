import React, { useEffect } from 'react'

import Modal from '@core/modal'
import Card from '@core/components/Card'
import Grid from '@core/components/Grid'
import Button from '@core/components/Button'
import Typography from '@core/components/Typography'

// recoil Import
import { useRecoilState } from 'recoil'
import { confirmModalRecoil } from '../../recoil/atom'
import { confirmModalState } from 'recoil/defaultValue'

const ConfirmModal = () => {
  const [confirmState, setConfirmState] = useRecoilState(confirmModalRecoil)

  const cancleAlertHaendler = () => {
    setConfirmState(confirmModalState)
  }

  const completeAlertHaendler = () => {
    confirmState.completeButtonCallback?.()
    setConfirmState(confirmModalState)
  }

  useEffect(() => {
    const enterKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && confirmState.isOpen) {
        completeAlertHaendler()
      }
    }

    window.document.addEventListener('keydown', enterKeydown)
    return () => {
      window.document.removeEventListener('keydown', enterKeydown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmState])

  return (
    <Modal open={confirmState.isOpen}>
      <Card type={2} style={{ minWidth: '20vw', left: '37%', top: '35%', outline: 'none' }}>
        <Grid type="container">
          <Grid type="item" style={{ padding: '20px' }} align="center">
            <Typography fontSize="body1" style={{ whiteSpace: 'pre-line' }}>
              {confirmState.alertText}
            </Typography>
          </Grid>
          <Grid type="item">
            <Grid type="container" align="center">
              <Grid type="item" area={8} style={{ marginRight: '12px' }}>
                <Button size="middum" style={{ height: '40px' }} onClick={cancleAlertHaendler} type="secondary">
                  취소
                </Button>
              </Grid>
              <Grid type="item" area={8}>
                <Button size="middum" style={{ height: '40px' }} onClick={completeAlertHaendler}>
                  확인
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </Modal>
  )
}

export default ConfirmModal
