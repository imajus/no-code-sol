const objectValueModelId = 'object';

export const createObjectValueModel = (configuration) => ({
  create: (path) => ({
    id: objectValueModelId,
    label: 'Object',
    path,
    configuration,
    getDefaultValue: () => configuration.defaultValue ?? {},
    getVariableDefinitions: () => null,
    validate: () => null,
  }),
});
