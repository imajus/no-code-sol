import {
  booleanValueModelId,
  nullableAnyVariableValueModelId,
  nullableVariableValueModelId,
  numberValueModelId,
  stringValueModelId,
} from 'sequential-workflow-editor-model';

export class DynamicsService {
  constructor($variables) {
    this.$variables = $variables;
  }

  readAny(dynamic) {
    switch (dynamic.modelId) {
      case stringValueModelId:
      case numberValueModelId:
      case booleanValueModelId:
        return dynamic.value;
      case nullableVariableValueModelId:
      case nullableAnyVariableValueModelId: {
        const variable = dynamic.value;
        if (!variable || !variable.name) {
          throw new Error('Variable is not set');
        }
        return this.$variables.read(variable.name);
      }
    }
    throw new Error(`Dynamic model is not supported: ${dynamic.modelId}`);
  }

  readString(dynamic) {
    const value = this.readAny(dynamic);
    if (typeof value !== 'string') {
      throw new Error('Value is not a string');
    }
    return value;
  }

  readNumber(dynamic) {
    const value = this.readAny(dynamic);
    if (typeof value !== 'number') {
      throw new Error('Value is not a number');
    }
    return value;
  }
}
