import { PhoneNumberBody, PhoneNumberResponse } from '../models/dataVerification';
import { SAMPLE_PHONE_DATABASE } from '../constants/sampleData';
import { IReq, IRes } from '../utils/types';

export const verifyPhoneNumber = (req: IReq<PhoneNumberBody>, res: IRes) => {
  const { phoneNumber } = req.body;

  try {
      // Normalize the phone number by removing dashes and spaces
      const normalizedPhoneNumber = phoneNumber.replace(/[-\s]/g, '');

      // Regular expression to match US phone number format after normalization
      const phoneRegex = /^\d{10}$/;  // Matches 10-digit numbers without country code

      if (!phoneRegex.test(normalizedPhoneNumber)) {
          throw new Error("Invalid phone number format");
      }

      // Check if the phone number exists in the database
      const personRecord = SAMPLE_PHONE_DATABASE.find(person => person.phoneNumber.replace(/[-\s]/g, '') === normalizedPhoneNumber);
      if (!personRecord) {
          throw new Error("No match found for provided phone number details");
      }

      // Simulate a successful verification if phone number found
      const result: PhoneNumberResponse = { verified: true };
      return res.json(result);
  } catch (err) {
      console.log(`Encountered an error verifying phone number: ${err.message}`);
      const result: PhoneNumberResponse = { verified: false, verifyFailureReason: err.message };
      return res.json(result);
  }
};
