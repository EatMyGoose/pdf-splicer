export type TReducer<T> = (prev:T) => T

export type TReducerConsumer<T> = (reducer: TReducer<T>) => void