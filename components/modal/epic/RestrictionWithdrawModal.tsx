import Button from '@core/components/Button'
import Card from '@core/components/Card'
import Grid from '@core/components/Grid'
import TextArea from '@core/components/TextArea'
import Typography from '@core/components/Typography'
import Modal from '@core/modal'
import { putMemberRestrictionWithdraw } from 'api/epicApi'
import React from 'react'
import { useRecoilState } from 'recoil'
import { alertModalRecoil, confirmModalRecoil } from 'recoil/atom'

/**
 * @param restrictionSeq 이용제한 정보 시퀀스
 * @param seq 이용제한 유저 시퀀스
 */
interface I_withdraw {
  restrictionSeq: number
  seq: number
}

interface I_restrictionWithdrawModalProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  data: I_withdraw
  confirmCallback: () => void
}

/**
 *
 */
const RestrictionWithdrawModal = (props: I_restrictionWithdrawModalProps) => {
  const { isOpen, setIsOpen, data, confirmCallback } = props

  const [text, setText] = React.useState<string>('')

  const [, setAlertModalState] = useRecoilState(alertModalRecoil)
  const [, setConfirmModalState] = useRecoilState(confirmModalRecoil)

  const cancleAlertHaendler = () => {
    setIsOpen(false)
  }

  const completeAlertHaendler = () => {
    setConfirmModalState({
      isOpen: true,
      alertText: '이용제한을 철회하시겠습니까?',
      completeButtonCallback: () => {
        void putMemberRestrictionWithdraw({
          restrictionSeq: data.restrictionSeq,
          seq: data.seq,
          contents: text,
          status: 'F',
        }).then((response) => {
          if (response.data.status.code === 'E20002') {
            setAlertModalState({
              isOpen: true,
              alertText: '이용 제한 철회가 완료되었습니다',
              clickButtonCallback: () => {
                confirmCallback()
                setIsOpen(false)
              },
            })
          }
        })
      },
    })
  }

  const changeTextAreaHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.currentTarget.value)
  }

  return (
    <Modal open={isOpen}>
      <Card>
        <Grid type="container">
          <Grid type="item">
            <Typography style={{ fontWeight: '700' }}>이용제한 철회</Typography>
          </Grid>
          <Grid type="item" style={{ marginTop: '20px' }}>
            <Card color="purple" colorWeight="500" style={{ padding: '12px' }}>
              <Typography wrap="p" fontSize="element1">
                이용제한 철회 사유를 입력하세요.
              </Typography>
              <Typography wrap="p" fontSize="element1">
                이용제한 철회는 즉시 반영되어 제한이 철회된 회원은 정상적인 서비스 이용이 가능합니다.
              </Typography>
            </Card>
          </Grid>
          <Grid type="item" style={{ marginTop: '12px' }}>
            <Grid type="container" horizen="center">
              <Grid type="item" area={4} align="center">
                <Typography fontSize="body2" style={{ fontSize: '600' }}>
                  철회사유
                </Typography>
              </Grid>
              <Grid type="item" area={20}>
                <TextArea
                  value={text}
                  onChange={changeTextAreaHandler}
                  placeholder="내용을 입력하세요."
                  addOn={{ textCount: true }}
                  maxLength={300}
                  style={{ height: '250px' }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid type="item">
            <Grid type="container" align="center">
              <Grid type="item" area={4} style={{ marginRight: '12px' }}>
                <Button size="middum" style={{ height: '40px' }} onClick={cancleAlertHaendler} type="secondary">
                  취소
                </Button>
              </Grid>
              <Grid type="item" area={6}>
                <Button size="middum" style={{ height: '40px' }} onClick={completeAlertHaendler}>
                  이용제한 철회하기
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </Modal>
  )
}

export default RestrictionWithdrawModal
