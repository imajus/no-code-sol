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
    const value = this.state[name];
    if (value === undefined) {
      throw new Error(`Cannot read unset variable: ${name}`);
    }
    return castTo(value, cast);
  }

  resolve(input, cast) {
    for (const [name, value] of Object.entries(this.state)) {
      // eslint-disable-next-line no-param-reassign
      input = input.replace(`{${name}}`, value);
    }
    return castTo(input, cast);
  }

  set(name, value) {
    if (value == null) {
      throw new Error('Cannot set variable to null/undefined');
    }
    this.state[name] = String(value);
  }

  isSet(name) {
    return this.state[name] !== undefined;
  }

  delete(name) {
    delete this.state[name];
  }
}
