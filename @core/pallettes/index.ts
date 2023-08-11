export interface I_colorType {
  color?: keyof typeof colorSet
  colorWeight?: 'default' | '700' | '600' | '500' | '400' | '300' | '200' | '100'
}

export interface I_pallettes extends I_colorType {
  type?: 'primary' | 'secondary' | 'disabled' | 'table'
}

const defaultPallettes = ({ color = 'purple', type = 'primary', colorWeight = '700' }: I_pallettes) => {
  const colorWeightPath: 'default' | 'p700' | 'p600' | 'p500' | 'p400' | 'p300' | 'p200' | 'p100' = colorWeight !== 'default' ? `p${colorWeight}` : colorWeight
  const result = {
    primary: {
      backgroundColor: colorSet[color][colorWeightPath],
      color: colorSet.white.default,
      hover: {
        backgroundColor: colorSet[color].default,
        color: colorSet.white.default,
      },
    },
    secondary: {
      backgroundColor: colorSet.white.default,
      color: colorSet[color][colorWeightPath],
      hover: {
        backgroundColor: colorSet.white.p700,
        color: colorSet[color].default,
      },
    },
    disabled: {
      backgroundColor: colorSet.black.p300,
      color: colorSet.black.p400,
    },
    table: {
      backgroundColor: colorSet.white.default,
      color: colorSet[color].p400,
      hover: {
        backgroundColor: colorSet[color].p200,
        color: colorSet[color].p400,
      },
    },
  }
  return result[type] as {
    backgroundColor: string
    color: string
    hover?: {
      backgroundColor: string
      color: string
    }
  }
}

export const colorSet = {
  black: {
    default: '#191919',
    p700: '#333333',
    p600: '#686868',
    p500: '#A1A1A4',
    p400: '#D0D0D2',
    p300: '#E5E5E8',
    p200: '#F3F3F6',
    p100: '#FAFAFB',
  },
  purple: {
    default: '#4942BE',
    p700: '#6D68CB',
    p600: '#928ED8',
    p500: '#B6B3E5',
    p400: '#DBD9F2',
    p300: '#EDECF9',
    p200: '#F6F6FC',
    p100: '#FBFBFE',
  },
  red: {
    default: '#E75C58',
    p700: '#EA7D7D',
    p600: '#F09D9B',
    p500: '#F5BEBC',
    p400: '#FADEDE',
    p300: '#FDEFEE',
    p200: '#FEF7F7',
    p100: '#FFFCFC',
  },
  yellow: {
    default: '#FFC700',
    p700: '#FFCF26',
    p600: '#FFD84D',
    p500: '#FFDD66',
    p400: '#FFE999',
    p300: '#FFF4CC',
    p200: '#FFF9E5',
    p100: '#FFFCF0',
  },
  blue: {
    default: '#0099FF',
    p700: '#1AA3FF',
    p600: '#33ADFF',
    p500: '#66C2FF',
    p400: '#99D6FF',
    p300: '#CCEBFF',
    p200: '#E5F5FF',
    p100: '#F2FAFF',
  },
  green: {
    default: '#93EF7C',
    p700: '#9EF189',
    p600: '#A8F296',
    p500: '#BEF5B0',
    p400: '#D4F9CA',
    p300: '#E9FCE5',
    p200: '#F4FDF2',
    p100: '#FAFEF9',
  },
  white: {
    default: '#FFFFFF',
    p700: '#FAFAFB',
    p600: '#F3F3F6',
    p500: '#E5E5E8',
    p400: '#D0D0D2',
    p300: '#A1A1A4',
    p200: '#686868',
    p100: '#333333',
  },
  excel: {
    default: '#0AB143',
    p700: '#0AB143',
    p600: '#0AB143',
    p500: '#0AB143',
    p400: '#0AB143',
    p300: '#0AB143',
    p200: '#0AB143',
    p100: '#0AB143',
  },
}

export const fontClassSet = {
  title1: 'fontSize48',
  title2: 'fontSize40',
  subtitle1: 'fontSize32',
  subtitle2: 'fontSize24',
  body1: 'fontSize20',
  body2: 'fontSize16',
  element1: 'fontSize14',
  element2: 'fontSize12',
}
export default defaultPallettes
