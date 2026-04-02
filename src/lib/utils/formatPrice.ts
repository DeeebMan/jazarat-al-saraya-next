export function formatPrice(price: number, currency: string = 'جنيه'): string {
  return `${price} ${currency}`;
}
