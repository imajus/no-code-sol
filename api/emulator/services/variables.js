/**
 *
 */
// export function autoCast(value) {
//   if (typeof value === 'string') {
//     // See if value contains type definition
//     const match = value.match(/^(?:(.+):)(.+)$/);
//     if (match) {
//       // First, cast to specified type
//       const type = match[1];
//       switch (type) {
//         case 'boolean':
//           return Boolean(match[2]);
//         case 'uint256':
//           return BigInt(match[2]);
//         case 'string':
//         case 'address':
//         default:
//           return match[2];
//       }
//     }
//   }
//   return value;
// }

/**
 * @param {string} value
 * @param {object} cast
 * @returns {*}
 */
// export function castTo(value, cast) {
//   switch (cast) {
//     case String:
//       return String(value);
//     case Number:
//       return Number(value);
//     case Boolean:
//       return Boolean(value);
//     case BigInt:
//       return BigInt(value);
//     default:
//       return value;
//   }
// }

function convertStaticValue(value, type) {
  switch (type) {
    case 'uint256':
      return BigInt(value);
    case 'string':
    case 'address':
      return String(value);
    case 'boolean':
      return Boolean(value);
    default:
      throw new Error(`Unsupported target type: ${type}`);
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
  /**
   * @type {Map<string, ValueTypeName>}
   */
  types = new Map();

  constructor(state) {
    this.state = state;
  }

  define(name, type) {
    if (this.types.has(name)) {
      throw new Error(`Variable already defined: ${name}`);
    }
    this.types.set(name, type);
  }

  typeOf(name) {
    return this.types.get(name);
  }

  get(name) {
    return this.state[name];
  }

  resolve(input) {
    if ('name' in input) {
      // Mapping access
      if ('key' in input) {
        const mapping = this.get(input.name) ?? {};
        const key = this.resolve(input.key);
        return mapping[key];
      } else {
        // State variable
        return this.get(input.name);
      }
    } else if ('path' in input) {
      // Nested variable
      const root = this.get(input.path[0]);
      return input.path.slice(1).reduce((value, part) => value?.[part], root);
    } else {
      return convertStaticValue(input.value, input.type);
    }
  }

  set(input, value) {
    if (typeof input === 'string') {
      this.state[input] = value;
    } else if ('name' in input) {
      // Mapping
      if ('key' in input) {
        const mapping = this.get(input.name) ?? {};
        const key = this.resolve(input.key);
        mapping[key] = value;
      } else {
        this.set(input.name, value);
      }
    } else {
      throw new Error(`Unsupported input: ${JSON.stringify(input)}`);
    }
  }

  isSet(name) {
    return name in this.state;
  }

  delete(name) {
    delete this.state[name];
  }

  format(pattern) {
    return pattern.replaceAll(/{(.+?)}/, (match) => this.get(match[1]));
  }
}
