export function cn(...classes: (string | undefined | boolean)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function truncate(str: string, len: number): string {
  return str.length > len ? str.slice(0, len) + '...' : str
}