import { createWorkflowMachineBuilder } from 'sequential-workflow-machine';
import { activitySet } from './activities';
import { VariablesService } from './services/variables';
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
      const $variables = new VariablesService(state);
      const $logger = new LoggerService(onLog);
      return {
        startTime: new Date(),
        state,
        $variables,
        $logger,
      };
    },
  });
  return new Promise((resolve, reject) => {
    try {
      interpreter.onChange((context, history) => {
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
