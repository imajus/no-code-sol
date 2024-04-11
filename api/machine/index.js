import { createWorkflowMachineBuilder } from 'sequential-workflow-machine';
import { activitySet } from './activities';
import { VariablesService, createVariableState } from './services/variables';
import { DynamicsService } from './services/dynamics';
import { LoggerService } from './services/logger';

const builder = createWorkflowMachineBuilder(activitySet);

/**
 *
 * @param {MyDefinition} definition
 * @param {VariableState} state
 * @param {(path: string[]) => void} onStateChanged
 * @param {(message: string) => void} onLog
 */
export function executeMachine(definition, state, onStateChanged, onLog) {
  const machine = builder.build(definition);
  const interpreter = machine.create({
    init: () => {
      const variablesState = createVariableState(state);
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
