import { createActivitySet } from 'sequential-workflow-machine';
import { logActivity } from './activities/log';
import { calculateActivity } from './activities/calculate';

export const activitySet = createActivitySet([logActivity, calculateActivity]);
