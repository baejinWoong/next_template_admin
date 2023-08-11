import defaultPallettes, { I_colorType, fontClassSet } from '@core/pallettes'
import React, { useState } from 'react'

interface I_tabs {
  name: string
  key: string
}

/**
 *
 */

interface I_tabProps {
  tabs: I_tabs[]
  disabled?: boolean
  onChange?: (value: string) => void
  fontSize?: 'title1' | 'title2' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'element1' | 'element2'
  type?: 'simple' | 'primary' | 'secondary'
  color?: I_colorType['color']
  style?: React.CSSProperties
}

const Tab = (props: I_tabProps) => {
  const { fontSize = 'body2', type = 'simple', color = 'purple', style } = props
  const getPallette = defaultPallettes({ type: 'secondary', color })

  const [activeTab, setActiveTab] = useState(0)

  const onChangeHandler = (event: React.MouseEvent<HTMLButtonElement>, index: number) => {
    setActiveTab(index)
    props.onChange?.(event?.currentTarget.value)
  }

  return (
    <nav className={`tab type${typeSet[type]}`}>
      {props.tabs.map((data, index) => {
        return (
          <button
            key={Math.random().toString().replace('0.', '')}
            type="button"
            className={`${activeTab === index ? 'active' : ''} ${fontClassSet[fontSize]}`}
            value={data.key}
            style={{
              color: activeTab === index ? getPallette.color : '',
              ...style,
            }}
            onClick={(event) => {
              onChangeHandler(event, index)
            }}
          >
            {data.name}
            {activeTab === index && <div className="tabBefore" style={{ backgroundColor: activeTab === index ? getPallette.color : '' }} />}
          </button>
        )
      })}
    </nav>
  )
}

export default Tab

const typeSet = {
  simple: '01',
  primary: '02',
  secondary: '03',
}
