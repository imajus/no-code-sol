import { createActivitySet } from 'sequential-workflow-machine';
import { logActivity } from './activities/log';

export const activitySet = createActivitySet([logActivity]);
