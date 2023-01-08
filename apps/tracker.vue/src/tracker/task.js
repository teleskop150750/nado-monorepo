export const IMPORTANCE = {
  HIGH: {
    label: 'Высокая',
    value: 'HIGH',
  },
  NORMAL: {
    label: 'Обычная',
    value: 'NORMAL',
  },
  LOW: {
    label: 'Низкая',
    value: 'LOW',
  },
}

export const STATUSES = {
  NEW: {
    label: 'Новое',
    value: 'NEW',
    color: '207deg 90% 54%',
  },
  IN_WORK: {
    label: 'В работе',
    value: 'IN_WORK',
    color: '193deg 54% 62%',
  },
  DONE: {
    label: 'Выполнено',
    value: 'DONE',
    color: '80deg 48% 55%',
  },
  WAITING: {
    label: 'В ожидании',
    value: 'WAITING',
    color: '0deg 0% 62%',
  },
  CANCELLED: {
    label: 'Отменено',
    value: 'CANCELLED',
    color: '0deg 0% 62%',
  },
}

export const RELATIONSHIP_TYPES = {
  END_START: {
    label: 'Конец-начало',
    value: 'END_START',
  },
  START_START: {
    label: 'Начало-начало',
    value: 'START_START',
  },
  END_END: {
    label: 'Конец-конец',
    value: 'END_END',
  },
  START_END: {
    label: 'Начало-конец',
    value: 'START_END',
  },
}

export const RIGHTS = ['CAN_BEGIN_TASK', 'CAN_END_TASK']
