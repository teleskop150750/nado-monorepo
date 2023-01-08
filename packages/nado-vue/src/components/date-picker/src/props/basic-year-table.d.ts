import type { ExtractPropTypes } from 'vue'

export const basicYearTableProps: {
  date: {
    type: ObjectConstructor
    required: boolean
  }
  disabledDate: {
    type: FunctionConstructor
  }
  parsedValue: {
    type: (ObjectConstructor | ArrayConstructor)[]
  }
}

export type BasicYearTableProps = ExtractPropTypes<typeof basicYearTableProps>
