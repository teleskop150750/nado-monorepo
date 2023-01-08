import { v4 } from 'uuid'

/**
 * @return {string}
 */
export const generateId = () => v4()

/**
 * Generating a random int in range (0, max - 1)
 * @param max {number}
 */
export const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max))
