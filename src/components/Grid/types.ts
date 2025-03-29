export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: number
  sm?: number
  md?: number
  lg?: number
  xl?: number
  gap?: number
}

export interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  span?: number
  sm?: number
  md?: number
  lg?: number
  xl?: number
  '2xl'?: number
}
