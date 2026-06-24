export function numberToWords(amount: number): string {
  const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

  if (amount === 0) return 'Zero'

  function convertChunk(n: number): string {
    if (n < 20) return units[n]
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + units[n % 10] : '')
    if (n < 1000) return units[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + convertChunk(n % 100) : '')
    return ''
  }

  let word = ''
  
  // Handle Crores
  if (Math.floor(amount / 10000000) > 0) {
    word += convertChunk(Math.floor(amount / 10000000)) + ' Crore '
    amount %= 10000000
  }
  
  // Handle Lakhs
  if (Math.floor(amount / 100000) > 0) {
    word += convertChunk(Math.floor(amount / 100000)) + ' Lakh '
    amount %= 100000
  }
  
  // Handle Thousands
  if (Math.floor(amount / 1000) > 0) {
    word += convertChunk(Math.floor(amount / 1000)) + ' Thousand '
    amount %= 1000
  }
  
  // Handle Hundreds/Tens/Units
  if (amount > 0) {
    word += convertChunk(Math.floor(amount))
  }

  return word.trim() + ' Only'
}
