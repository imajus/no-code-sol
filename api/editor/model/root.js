import {
  createRootModel,
  createSequenceValueModel,
  createVariableDefinitionsValueModel,
} from 'sequential-workflow-editor-model';

/**
 * @type MyDefinition
 */
export const rootModel = createRootModel((root) => {
  root.property('inputs').value(createVariableDefinitionsValueModel({}));
  root
    .property('outputs')
    .hint('Variables returned from the workflow.')
    .value(createVariableDefinitionsValueModel({}))
    .label('Outputs');
  root.sequence().value(
    createSequenceValueModel({
      sequence: [],
    }),
  );
});
