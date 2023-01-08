import type { Dayjs } from 'dayjs'

import type { DateCell } from './date-picker.type'

type DayRange = [Dayjs | undefined, Dayjs | undefined]

export const isValidRange: (range: DayRange) => boolean

type GetDefaultValueParams = {
  lang: string
  unit: 'month' | 'year'
  unlinkPanels: boolean
}

export type DefaultValue = [Date, Date] | Date | undefined

export const getDefaultValue: (
  defaultValue: DefaultValue,
  { lang, unit, unlinkPanels }: GetDefaultValueParams,
) => Dayjs[]

type Dimension = {
  row: number
  column: number
}

type BuildPickerTableMetadata = {
  startDate?: Dayjs | null
  unit: 'month' | 'day'
  columnIndexOffset: number
  now: Dayjs
  nextEndDate: Dayjs | null
  relativeDateGetter: (index: number) => Dayjs
  setCellMetadata?: (cell: DateCell, dimension: { rowIndex: number; columnIndex: number }) => void
  setRowMetadata?: (row: DateCell[]) => void
}

export const buildPickerTable: (
  dimension: Dimension,
  rows: DateCell[][],
  {
    columnIndexOffset,
    startDate,
    nextEndDate,
    now,
    unit,
    relativeDateGetter,
    setCellMetadata,
    setRowMetadata,
  }: BuildPickerTableMetadata,
) => void
