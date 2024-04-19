import { createActivitySet } from 'sequential-workflow-machine';
import { logActivity } from './activities/log';
import { calculateActivity } from './activities/calculate';
import { convertValueActivity } from './activities/convert';
import { ifActivity } from './activities/if';
import { loopActivity } from './activities/loop';
import { functionsActivity } from './activities/functions';
import { variableActivity } from './activities/variable';
import { returnActivity } from './activities/return';
import { argumentActivity } from './activities/argument';

export const activitySet = createActivitySet([
  logActivity,
  calculateActivity,
  convertValueActivity,
  ifActivity,
  loopActivity,
  functionsActivity,
  variableActivity,
  returnActivity,
  argumentActivity,
]);
