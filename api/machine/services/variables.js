// /**
//  *
//  * @param {VariableState} state
//  * @returns {VariableState}
//  */
// export function createVariableState(state) {
//   return state ?? {};
// }

// export class VariablesService {
//   state;

//   /**
//    *
//    * @param {VariableState} state
//    */
//   constructor(state) {
//     this.state = state;
//   }

//   /**
//    *
//    * @param {string} name
//    * @returns {*}
//    */
//   read(name) {
//     const value = this.state[name];
//     if (value === undefined) {
//       throw new Error(`Cannot read unset variable: ${name}`);
//     }
//     return value;
//   }

//   /**
//    *
//    * @param {string} name
//    * @param {*} value
//    */
//   set(name, value) {
//     if (value === undefined) {
//       throw new Error('Cannot set variable to undefined');
//     }
//     this.state[name] = value;
//   }

//   /**
//    *
//    * @param {string} name
//    * @returns {Boolean}
//    */
//   isSet(name) {
//     return this.state[name] !== undefined;
//   }

//   /**
//    *
//    * @param {string} name
//    */
//   delete(name) {
//     delete this.state[name];
//   }
// }
