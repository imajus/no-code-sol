export class LoggerService {
  onLog;

  constructor(onLog) {
    this.onLog = onLog;
  }

  log(message) {
    this.onLog(message);
  }
}
