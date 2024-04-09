import { createActivitySet } from 'sequential-workflow-machine';
import { logActivity } from './activities/log';
import { calculateActivity } from './activities/calculate';
import { convertValueActivity } from './activities/convert-value';

export const activitySet = createActivitySet([
  logActivity,
  calculateActivity,
  convertValueActivity,
]);
