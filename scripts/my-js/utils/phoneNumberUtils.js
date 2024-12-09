export function formatPhoneNumber(phoneNumber) {
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');
    const countryCode = cleaned.substring(0, cleaned.length - 10);
    const phonePart = cleaned.substring(cleaned.length - 10);
    return `+${countryCode} ${phonePart.substring(0, 3)}-${phonePart.substring(3, 6)}-${phonePart.substring(6)}`;
}