export class PhoneNumberManager {
  static instance = null;
  phoneNumber = null;

  static getInstance() {
    if (!PhoneNumberManager.instance) {
      PhoneNumberManager.instance = new PhoneNumberManager();
    }
    return PhoneNumberManager.instance;
  }

  setPhoneNumber(phoneNumber) {
    this.phoneNumber = phoneNumber;
  }

  getPhoneNumber() {
    return this.phoneNumber;
  }
}
