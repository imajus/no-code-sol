import { SyncedCron } from 'meteor/littledata:synced-cron';

SyncedCron.config({
  collectionName: 'cron',
  collectionTTL: 60,
});

// Uncomment this to auto-start the CRON
// SyncedCron.start();
