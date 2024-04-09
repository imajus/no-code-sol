import { createActivitySet } from 'sequential-workflow-machine';
import { logActivity } from './activities/log';
import { calculateActivity } from './activities/calculate';
import { convertValueActivity } from './activities/convert-value';
import { ifActivity } from './activities/if';
import { loopActivity } from './activities/loop';

export const activitySet = createActivitySet([
  logActivity,
  calculateActivity,
  convertValueActivity,
  ifActivity,
  loopActivity,
]);
