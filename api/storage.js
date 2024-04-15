export class AppStorage {
  name;

  constructor(name) {
    this.name = name;
  }

  get() {
    const value = localStorage[this.name];
    return value ? JSON.parse(value) : null;
  }

  set(value) {
    window.localStorage[this.name] = JSON.stringify(value);
  }

  reset() {
    delete window.localStorage[this.name];
  }
}
