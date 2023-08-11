import React from 'react'
import { DefaultImg } from '@core/icons'

interface I_imgParams extends React.ImgHTMLAttributes<HTMLImageElement> {}

/**
 *
 */
const Img = (props: I_imgParams) => {
  const [isLoad, setIsLoad] = React.useState<boolean>(false)
  const imgStyle = {
    ...props,
    style: { ...props.style, display: isLoad ? 'block' : 'none' },
  }

  React.useEffect(() => {
    if (!isLoad) {
      const img = new Image()
      img.src = props.src ?? ''
      img.onload = () => {
        setIsLoad(true)
      }
    }
  }, [isLoad, props.src])
  return (
    <>
      {!isLoad && <i>{DefaultImg}</i>}
      <img {...imgStyle} alt={props.alt} />
    </>
  )
}

export default Img
