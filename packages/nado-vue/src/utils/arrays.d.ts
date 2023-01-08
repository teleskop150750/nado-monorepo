export declare const unique: <T>(arr: T[]) => T[]
export declare type Many<T> = T | ReadonlyArray<T>

export declare const ensureArray: <T>(arr: Many<T>) => T[]
export { castArray } from 'lodash-unified'
