/**
 * Генерировать случайное число в диапазоне [0, 1000]
 * Может быть, заменить на [uuid](https://www.npmjs.com/package/uuid)
 */
export const generateId = (): number => Math.floor(Math.random() * 10000);

/**
 * Генерация случайного int в диапазоне (0, max - 1)
 * @param max {number}
 */
export const getRandomInt = (max: number) =>
  Math.floor(Math.random() * Math.floor(max));
