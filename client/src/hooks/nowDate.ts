export const nowDate = () => {
  const date = new Date()
  const now_utc = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  )
  const nowDate = new Date(now_utc)
  return nowDate
}
