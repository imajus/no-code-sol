import {
  SimpleEvent,
  WellKnownValueType,
} from 'sequential-workflow-editor-model';

/**
 *
 * @param {string} text
 * @param {ValueType} type
 * @returns {*}
 */
function convertInputValue(text, type) {
  switch (type) {
    case WellKnownValueType.string:
      return text;
    case WellKnownValueType.number: {
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

export class Playground {
  /**
   * @private
   * @type {VariableDefinition[]}
   */
  inputVariables;
  /**
   * @readonly
   * @type {RawInputData}
   */
  inputData;
  /**
   * @readonly
   * @type {RawInputData}
   */
  outputData = {};
  /**
   * @private
   * @type {Record<string, HTMLInputElement>}
   */
  outputFields = {};
  /**
   * @readonly
   * @type {SimpleEvent<void>}
   */
  onInputChanged = new SimpleEvent();
  /**
   * @readonly
   * @type {HTMLElement}
   */
  logs;

  /**
   * @readonly
   * @type {HTMLElement}
   */
  inputList;
  /**
   * @readonly
   * @type {HTMLElement}
   */
  outputList;

  constructor(logs, inputData, inputList, outputList) {
    this.logs = logs;
    this.inputData = inputData;
    this.inputList = inputList;
    this.outputList = outputList;
  }

  /**
   *
   * @param {MyDefinition} definition
   */
  updateVariables(definition) {
    this.reloadFields(
      this.inputList,
      definition.properties.inputs,
      this.inputData,
    );
    this.inputVariables = definition.properties.inputs.variables;
    this.outputFields = this.reloadFields(
      this.outputList,
      definition.properties.outputs,
      null,
    );
  }

  /**
   *
   * @returns {RawInputData}
   */
  readInputData() {
    return this.inputData;
  }

  /**
   *
   * @returns {VariableState}
   */
  readInputVariableState() {
    if (!this.inputVariables) {
      throw new Error('Input variables not set');
    }
    return this.inputVariables.reduce(
      /**
       *
       * @param {VariableState} values
       * @param {MyDefinition} definition
       * @returns
       */
      (values, definition) => {
        const input = this.inputData[definition.name] || '';
        values[definition.name] = convertInputValue(input, definition.type);
        return values;
      },
      {},
    );
  }

  /**
   *
   * @param {string} name
   * @param {*} value
   */
  setOutputVariable(name, value) {
    let str;
    if (typeof value === 'string') {
      str = value;
    } else {
      str = JSON.stringify(value);
    }
    this.outputData[name] = str;
    const field = this.outputFields[name];
    if (field) {
      field.value = str;
    }
  }

  clearLogs() {
    this.logs.innerHTML = '';
  }

  /**
   *
   * @param {string} message
   * @param {string} level
   */
  log(message, level = 'info') {
    const log = document.createElement('div');
    log.className = `log log-${level}`;
    for (const line of message.split('\n')) {
      const item = document.createElement('div');
      item.innerText = line;
      log.appendChild(item);
    }
    this.logs.appendChild(log);
    this.logs.scrollTop = this.logs.scrollHeight;
  }

  /**
   *
   * @private
   * @param {HTMLElement} list
   * @param {VariableDefinitions} definitions
   * @param {Record<string, string>} data
   * @returns {Record<string, HTMLInputElement>}
   */
  reloadFields(list, definitions, data) {
    /**
     * @type {Record<string, HTMLInputElement>}
     */
    const fields = {};
    list.innerHTML = '';
    for (const definition of definitions.variables) {
      if (!definition.name) {
        continue;
      }
      const row = document.createElement('div');
      row.className = 'variable-row';
      const label = document.createElement('label');
      label.innerText = definition.name;
      const input = document.createElement('input');
      input.type = 'text';
      if (data) {
        input.value = data[definition.name] || '';
        input.addEventListener('blur', () => {
          data[definition.name] = input.value;
          this.onInputChanged.forward();
        });
      } else {
        input.setAttribute('readonly', 'readonly');
      }
      row.appendChild(label);
      row.appendChild(input);
      list.appendChild(row);
      fields[definition.name] = input;
    }
    return fields;
  }
}
