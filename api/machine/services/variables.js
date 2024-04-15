/**
 *
 * @param {VariableState} state
 * @returns {VariableState}
 */
// export function createVariableState(state) {
//   return state ?? {};
// }

/**
 * @param {string} value
 * @param {object} cast
 * @returns {*}
 */
export function castTo(value, cast) {
  switch (cast) {
    case String:
      return String(value);
    case Number:
      return Number(value);
    case Boolean:
      return Boolean(value);
    case BigInt:
      return BigInt(value);
    default:
      return value;
  }
}

/**
 * @implements {IVariableService}
 */
export class VariablesService {
  /**
   * @type {VariableState}
   */
  state;

  constructor(state) {
    this.state = state;
  }

  get(name, cast) {
    let value;
    const match = name.match(/(.+)\[(.+)\]/);
    if (match) {
      const mapping = this.state[match[1]];
      if (!Array.isArray(mapping)) {
        throw new Error(`Expected to be an array: ${match[1]}`);
      }
      const key = this.isSet(match[2]) ? this.get(match[2]) : match[2];
      value = mapping.find((item) => item.key === key)?.value;
    } else {
      value = this.state[name];
    }
    if (value == null) {
      throw new Error(`Cannot read unset variable: ${name}`);
    }
    return castTo(value, cast);
  }

  resolve(input, cast) {
    for (const [name, value] of Object.entries(this.state)) {
      const regex = new RegExp(`{${name}\\[(.+?)\\]}`);
      do {
        const output = input.replace(regex, (match, param) => {
          const mapping = value;
          if (!Array.isArray(mapping)) {
            throw new Error(`Expected to be an array: ${match[1]}`);
          }
          const key = this.isSet(param) ? this.get(param) : param;
          return mapping.find((item) => item.key === key)?.value ?? '';
        });
        if (output === input) {
          break;
        }
        // eslint-disable-next-line no-param-reassign
        input = output;
      } while (true);
      // eslint-disable-next-line no-param-reassign
      input = input.replaceAll(`{${name}}`, value);
    }
    return castTo(input, cast);
  }

  set(name, value) {
    if (value == null) {
      throw new Error('Cannot set variable to null/undefined');
    }
    const match = name.match(/(.+)\[(.+)\]/);
    if (match) {
      const mapping = this.state[match[1]];
      if (!Array.isArray(mapping)) {
        throw new Error(`Expected to be an array: ${match[1]}`);
      }
      const key = this.isSet(match[2]) ? this.get(match[2]) : match[2];
      const item = mapping.find((item) => item.key === key);
      if (item) {
        item.value = value;
      } else {
        mapping.push({ key, value: value });
      }
      this.state[match[1]] = mapping;
    } else {
      this.state[name] = value;
    }
  }

  isSet(name) {
    return name in this.state;
  }

  delete(name) {
    delete this.state[name];
  }
}
