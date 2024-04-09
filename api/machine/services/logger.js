import { SimpleEvent } from 'sequential-workflow-editor-model';

export class LoggerService {
  onLog = new SimpleEvent();

  log(message) {
    this.onLog.forward(message);
  }
}
