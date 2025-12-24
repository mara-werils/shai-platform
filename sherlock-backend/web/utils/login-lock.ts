const MAX_ATTEMPTS = 5
const BLOCK_TIME = 5 * 60 * 1000

export function isBlocked(): boolean {
  const blockedUntil = localStorage.getItem('user_blocked_until')
  if (!blockedUntil) return false

  const until = Number(blockedUntil)
  if (Date.now() < until) return true

  clearAttempts()
  return false
}

export function addFailedAttempt(): void {
  if (isBlocked()) return

  const attempts = Number(localStorage.getItem('login_attempts') || '0') + 1
  localStorage.setItem('login_attempts', attempts.toString())

  if (attempts >= MAX_ATTEMPTS) {
    const until = Date.now() + BLOCK_TIME
    localStorage.setItem('user_blocked_until', until.toString())
  }
}

export function clearAttempts(): void {
  localStorage.removeItem('login_attempts')
  localStorage.removeItem('user_blocked_until')
}

