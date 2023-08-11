/* eslint-disable no-useless-escape */
/**
 *
 * @param html ex) <img src=......
 */
export const getImgTags = (html: string) => {
  const getImgTagExp = /<img[^>]*src\s*=\s*[\"']?([^>\"']+)[\"']?[^>]*>/g
  return html.match(getImgTagExp)
}

/**
 *
 * @param tag ex) src= .....
 */
export const getSrcBase64 = (tag: string) => {
  const getSrcExp = /src=["\']?[^>"\']+/i
  return tag.match(getSrcExp)?.toString().replaceAll('src=', '')
}

/**
 *
 * @param text input Text
 * @param regType checked Regexp type
 */
export const checkedRegType = (text: string, regType: 'text' | 'number' | 'textAndNumber' | 'email') => {
  switch (regType) {
    case 'number':
      return /^[0-9 ]*$/g.test(text)
    case 'text':
      return /^[a-zA-Zㄱ-ㅎ|ㅏ-ㅣ|가-힣 ]*$/g.test(text)
    case 'textAndNumber':
      return /^[a-zA-Zㄱ-ㅎ|ㅏ-ㅣ|가-힣|0-9 ]*$/.test(text)
    case 'email':
      return /[a-z0-9.]+@elwide.com/.test(text)
    default:
      break
  }
}
