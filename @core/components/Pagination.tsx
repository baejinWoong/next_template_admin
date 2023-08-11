import React from 'react'

interface I_pagenation {
  rowPerPage: number
  totalNumber: number
  page?: number
  pageLabelNumber: number
  align?: 'left' | 'center' | 'right'
  onPageChange?: (page: number) => void
}
const INIT_ACTIVE_PAGE = 1

/**
 * @param pageLabelNumber label view button count number
 * @example pageLabelNumber 5 =>  < 1, 2, 3, 4, 5 >
 * @param page pageprops minimum props value is 1
 */
const Pagination = (props: I_pagenation) => {
  const [activePage, setActivePage] = React.useState(props.page ? props.page : INIT_ACTIVE_PAGE)
  const [activePageLabel, setActivePageLabel] = React.useState(Math.ceil((props.page ?? INIT_ACTIVE_PAGE) / props.pageLabelNumber))

  const allPages = numberToArray(props.totalNumber / props.rowPerPage)
  const viewPages = allPages.filter((data) => {
    return Math.ceil(activePage / props.pageLabelNumber) === Math.ceil(data / props.pageLabelNumber)
  })

  const changePageHandler = (page: number) => {
    props.onPageChange?.(page)
    setActivePage(page)
  }

  const prevPageLabelHandler = () => {
    if (activePageLabel > 1) {
      setActivePageLabel((prevState) => prevState - 1)
      changePageHandler((activePageLabel - 2) * props.pageLabelNumber + 1)
    } else {
      changePageHandler(1)
    }
  }

  const nextPageLabelHandler = () => {
    const PageLabelNumber = Math.round(props.totalNumber / (props.rowPerPage * props.pageLabelNumber))
    if (activePageLabel < PageLabelNumber) {
      setActivePageLabel((prevState) => prevState + 1)
      changePageHandler(activePageLabel * props.pageLabelNumber + 1)
    } else {
      changePageHandler(allPages.length)
    }
  }

  React.useEffect(() => {
    setActivePage(props.page ? props.page : INIT_ACTIVE_PAGE)
    setActivePageLabel(Math.ceil((props.page ?? INIT_ACTIVE_PAGE) / props.pageLabelNumber))
  }, [props])

  if (allPages.length < 2) return <></>

  return (
    <div className={`pages ${alignSet[props.align ?? 'left']}`}>
      {viewPages.filter((data) => data === 1).length < 1 && (
        <button className="moveButton" type="button" onClick={prevPageLabelHandler}>
          이전
        </button>
      )}
      {viewPages.map((data, idx) => {
        return (
          <button
            type="button"
            className={activePage === data ? 'active' : ''}
            onClick={() => {
              changePageHandler(data)
            }}
            key={idx}
          >
            <span>{data}</span>
          </button>
        )
      })}
      {viewPages.filter((data) => data === allPages[allPages.length - 1]).length < 1 && (
        <button className="moveButton" type="button" onClick={nextPageLabelHandler}>
          다음
        </button>
      )}
    </div>
  )
}

export default Pagination

const numberToArray = (number: number) => {
  const results = []
  for (let index = 0; index < number; index++) {
    results.push(index + 1)
  }
  return results
}

const alignSet = {
  left: 'alignLeft',
  center: 'alignCenter',
  right: 'alignRight',
}
