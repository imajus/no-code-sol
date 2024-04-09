const version = 3;
const definitionKey = `definition_${version}`;
const inputDataKey = `inputData_${version}`;

export class AppStorage {
  /**
   *
   * @returns {AppState}
   */
  static tryGet() {
    const definition = localStorage[definitionKey];
    const inputData = localStorage[inputDataKey];
    if (definition && inputData) {
      return {
        definition: JSON.parse(definition),
        inputData: JSON.parse(inputData),
      };
    }
    return null;
  }

  /**
   *
   * @param {MyDefinition} definition
   * @param {RawInputData} inputData
   */
  static set(definition, inputData) {
    window.localStorage[definitionKey] = JSON.stringify(definition);
    window.localStorage[inputDataKey] = JSON.stringify(inputData);
  }
}
