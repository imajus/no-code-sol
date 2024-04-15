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
    case 'uint256':
      return (text ?? '').trim();
    case 'number': {
      const value = parseFloat(text);
      if (Number.isNaN(value)) {
        throw new Error(`Invalid input number value: ${text || '<empty>'}`);
      }
      return value;
    }
    default:
      throw new Error(`Unknown variable type: ${type}`);
  }
}
