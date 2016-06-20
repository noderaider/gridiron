
/** MAP ON TO CALL A FUNCTION ONLY IN DEV AND PASS THROUGH, DOES NOT MUTATE THE INPUT */
export const devStream = devFn => x => voidStream(() => process.env.NODE_ENV === 'production' ? {} : devFn(x))

/** MAP ON TO CALL A VOID FUNCTION AND PASS THROUGH */
export const voidStream = voidFn => data => {
  voidFn(data)
  return data
}
