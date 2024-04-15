/**
 *
 * @param {string} text
 * @param {string} type
 * @returns {*}
 */
export function convertInputValue(text, type) {
  switch (type) {
    case 'string':
    case 'address':
      return (text ?? '').trim();
    case 'uint256':
      return BigInt(text ?? '');
    default:
      throw new Error(`Unknown variable type: ${type}`);
  }
}
