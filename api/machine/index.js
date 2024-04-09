import { createWorkflowMachineBuilder } from 'sequential-workflow-machine';
import { activitySet } from './activities';
import { VariablesService, createVariableState } from './services/variables';
import { DynamicsService } from './services/dynamics';
import { LoggerService } from './services/logger';

const builder = createWorkflowMachineBuilder(activitySet);

/**
 *
 * @param {MyDefinition} definition
 * @param {VariableState} variableValues
 * @param {onStateChanged} onStateChanged
 * @param {onLog} onLog
 * @returns {Promise<WorkflowMachineSnapshot<GlobalState>>}
 */
export function executeMachine(
  definition,
  variableValues,
  onStateChanged,
  onLog,
) {
  const machine = builder.build(definition);
  const interpreter = machine.create({
    init: () => {
      const variablesState = createVariableState(variableValues);
      const $variables = new VariablesService(variablesState);
      const $dynamics = new DynamicsService($variables);
      const $logger = new LoggerService();
      $logger.onLog.subscribe(onLog);
      return {
        startTime: new Date(),
        variablesState,
        $variables,
        $dynamics,
        $logger,
      };
    },
  });
  return new Promise((resolve, reject) => {
    try {
      interpreter.onChange(() => {
        const snapshot = interpreter.getSnapshot();
        onStateChanged(snapshot.getStatePath());
      });
      interpreter.onDone(() => {
        resolve(interpreter.getSnapshot());
      });
      interpreter.start();
    } catch (e) {
      reject(e);
    }
  });
}
