export class SingleTon {
  static instance = null;
  timer = null;
  ringtone = null;
  controlState = null;

  static getInstance() {
    if (!SingleTon.instance) {
      SingleTon.instance = new SingleTon();
    }
    return SingleTon.instance;
  }

  startTimer(callback) {
    if (this.timer) {
      clearInterval(this.timer); // Clear existing timer if one is already running
    }
    this.timer = setInterval(callback, 1000); // Start a new timer
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  startControlState(callback) {
    if (!this.controlState) {
      this.controlState = setInterval(callback, 1000);
    }
  }

  stopControlState() {
    if (this.controlState) {
      clearInterval(this.controlState);
      this.controlState = null;
    }
  }

  startRingTone(callback) {
    if (!this.ringtone) {
      this.ringtone = setInterval(callback, 1500);
    }
  }

  stopRingTone() {
    if (this.ringtone) {
      clearInterval(this.ringtone);
      this.ringtone = null;
    }
  }
}
