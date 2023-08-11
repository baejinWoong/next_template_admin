import Card from '@core/components/Card'
import Grid from '@core/components/Grid'
import Typography from '@core/components/Typography'
import { downArrowIcon, downGrapBar, nomalGrapBar, upperArrowIcon, upperGrapBar } from '@core/icons'
import { I_colorType } from '@core/pallettes'
import React from 'react'

interface I_chartBoxProps {
  title: string
  chartDefaultValue?: number
  chartDiffValue?: number
  size?: 'small' | 'large'
  upperColor?: I_colorType['color']
  downColor?: I_colorType['color']
}

/**
 *
 */
const ChartBox = (props: I_chartBoxProps) => {
  const { title, chartDefaultValue = 0, chartDiffValue = 0, size = 'small', upperColor = 'red', downColor = 'blue' } = props

  return (
    <Card>
      <Grid type="container">
        <Grid type="item">
          <Typography colorWeight="500" fontSize="element1">
            {title}
          </Typography>
        </Grid>
        <Grid type="item" area={size === 'small' ? 18 : 12}>
          <Grid type="container" horizen="center">
            <Grid type="item">
              <Typography fontSize="title2" style={{ fontWeight: '700' }}>
                {chartDefaultValue?.toLocaleString()}
              </Typography>
              {size === 'large' && (
                <>
                  <Typography
                    fontSize="body1"
                    style={{ marginLeft: '16px' }}
                    color={chartDiffValue && chartDiffValue > 0 ? upperColor : downColor}
                    colorWeight={chartDiffValue === 0 ? '500' : '700'}
                  >
                    {chartDiffValue && chartDiffValue > 0 ? upperArrowIcon : chartDiffValue === 0 ? '' : downArrowIcon}
                  </Typography>
                  <Typography
                    fontSize="body1"
                    style={{ marginLeft: '4px' }}
                    color={chartDiffValue && chartDiffValue > 0 ? upperColor : chartDiffValue === 0 ? 'black' : downColor}
                    colorWeight={chartDiffValue === 0 ? '500' : '700'}
                  >
                    {chartDiffValue && chartDiffValue > 0
                      ? chartDiffValue.toLocaleString()
                      : chartDiffValue === 0
                      ? '-'
                      : Math.abs(chartDiffValue).toLocaleString()}
                  </Typography>
                </>
              )}
            </Grid>
            {size === 'small' && (
              <Grid type="item">
                <Typography
                  fontSize="body1"
                  style={{ marginLeft: '4px' }}
                  color={chartDiffValue && chartDiffValue > 0 ? upperColor : chartDiffValue === 0 ? 'black' : downColor}
                  colorWeight={chartDiffValue === 0 ? '500' : '700'}
                >
                  {chartDiffValue && chartDiffValue > 0 ? upperArrowIcon : chartDiffValue === 0 ? '' : downArrowIcon}
                </Typography>
                <Typography
                  fontSize="body1"
                  style={{ marginLeft: '4px' }}
                  color={chartDiffValue && chartDiffValue > 0 ? upperColor : chartDiffValue === 0 ? 'black' : downColor}
                  colorWeight={chartDiffValue === 0 ? '500' : '700'}
                >
                  {chartDiffValue && chartDiffValue > 0
                    ? chartDiffValue.toLocaleString()
                    : chartDiffValue === 0
                    ? '-'
                    : Math.abs(chartDiffValue).toLocaleString()}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Grid>
        {size === 'small' && (
          <Grid type="item" area={6}>
            <Typography
              color={chartDiffValue && chartDiffValue > 0 ? upperColor : chartDiffValue === 0 ? 'black' : downColor}
              colorWeight={chartDiffValue === 0 ? '500' : '700'}
            >
              {chartDiffValue && chartDiffValue > 0 ? upperGrapBar : chartDiffValue === 0 ? nomalGrapBar : downGrapBar}
            </Typography>
          </Grid>
        )}
      </Grid>
    </Card>
  )
}

export default ChartBox
