export function createCookieInHour(cookieName, cookieValue, hourToExpire) {
  const date = new Date()
  date.setTime(date.getTime() + (hourToExpire * 60 * 60 * 1000))
  document.cookie = `${cookieName}=${cookieValue};expires=${date.toGMTString()}`
}

export function resetCookie(cookie) {
  return cookie.replace(/^ +/, '').replace(/=.*/, `=;expires='${new Date().toUTCString()};path=/`)
}

export function getCookieValue(sliceNum) {
  const cookie = document.cookie.split(';')
  return cookie[sliceNum]?.split('=')[1]
}
