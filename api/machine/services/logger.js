// import { SimpleEvent } from 'sequential-workflow-editor-model';

export class LoggerService {
  onLog; // = new SimpleEvent();

  constructor(onLog) {
    this.onLog = onLog;
  }

  log(message) {
    this.onLog(message);
  }
}
