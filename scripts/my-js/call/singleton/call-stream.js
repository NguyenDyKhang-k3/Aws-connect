export class CallStreamManager {
    static instance = null;
    callStream = null;
  
    static getInstance() {
      if (!CallStreamManager.instance) {
        CallStreamManager.instance = new CallStreamManager();
      }
      return CallStreamManager.instance;
    }
  
    setCallStream(callStream) {
      this.callStream = callStream;
    }
  
    getCallStream() {
      return this.callStream;
    }
  }
  