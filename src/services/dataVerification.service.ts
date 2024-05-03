import {
  BankAccountOwnerBody,
  BankAccountOwnerResponse,
  BankAccountBody,
  BankAccountResponse,
  EmailBody,
  EmailResponse,
  BusinessFEINBody,
  BusinessFEINResponse,
  PhoneNumberBody,
  PhoneNumberResponse,
  SSNBody,
  SSNResponse
} from '../models/dataVerification';
import { SAMPLE_BANK_ACCOUNTS, SAMPLE_BUSINESS_DATABASE, SAMPLE_SSN_DATABASE } from '../constants/sampleData';
import { IReq, IRes } from '../utils/types';

export const verifyBankAccountOwner = (req: IReq<BankAccountOwnerBody>, res: IRes) => {
  const {
    body: {
      accountNumber,
      accountType,
      routingNumber,
      firstName,
      lastName
    },
  } = req;
  try {
    // Check that accountNumber and routingNumber only contain digits
    if (!/^\d+$/.test(accountNumber)) {
      throw new Error('Invalid account number.');
    }
    if (!/^\d+$/.test(routingNumber) || routingNumber.length !== 9) {
      throw new Error('Invalid routing number. It must be 9 digits long.');
    }
    if (!['checking', 'savings'].includes(accountType.toLowerCase())) {
      throw new Error('Invalid account type. Only "checking" and "savings" are accepted.');
    }
    if (!firstName || !lastName) {
      throw new Error('First name and last name cannot be empty.');
    }

    // Mock database lookup
    const accountFound = SAMPLE_BANK_ACCOUNTS.find(acc =>
      acc.accountNumber === accountNumber &&
      acc.routingNumber === routingNumber &&
      acc.firstName.toLowerCase() === firstName.toLowerCase() &&
      acc.lastName.toLowerCase() === lastName.toLowerCase() &&
      acc.accountType.toLowerCase() === accountType.toLowerCase()
    );

    if (accountFound) {
      const result: BankAccountResponse = { verified: true }
      return res.json(result);
    } else {
      throw new Error('No matching account found. Verification failed.');
    }
  } catch (err) {
    console.error(`Encountered an error verifying bank account owner: ${err.message}`);
    const result: BankAccountOwnerResponse = { verified: false, verifyFailureReason: err.message };
    return res.json(result);
  }
};

export const verifyBankAccount = (req: IReq<BankAccountBody>, res: IRes) => {
  const {
    body: {
      accountNumber,
      accountType,
      routingNumber
    },
  } = req;
  try {
    // Check that accountNumber and routingNumber only contain digits
    if (!/^\d+$/.test(accountNumber)) {
      throw new Error('Invalid account number.');
    }
    if (!/^\d+$/.test(routingNumber) || routingNumber.length !== 9) {
      throw new Error('Invalid routing number. It must be 9 digits long.');
    }
    if (!['checking', 'savings'].includes(accountType.toLowerCase())) {
      throw new Error('Invalid account type. Only "checking" and "savings" are accepted.');
    }

    // Mock database lookup
    const accountFound = SAMPLE_BANK_ACCOUNTS.find(acc =>
      acc.accountNumber === accountNumber &&
      acc.routingNumber === routingNumber &&
      acc.accountType.toLowerCase() === accountType.toLowerCase()
    );

    if (accountFound) {
      const result: BankAccountResponse = { verified: true }
      return res.json(result);
    } else {
      throw new Error('No matching account found. Verification failed.');
    }
  } catch (err) {
    console.error(`Encountered an error verifying bank account: ${err.message}`);
    const result: BankAccountResponse = { verified: false, verifyFailureReason: err.message };
    return res.json(result);
  }
};

export const verifyEmail = (req: IReq<EmailBody>, res: IRes) => {
  const {
    body: {
      email
    },
  } = req;
  try {
    // Regular expression to check if the email is in a valid format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        throw new Error("Invalid email format.");
    }

    const result: EmailResponse = { verified: true };
    return res.json(result);
  } catch (err) {
    console.error(`Encountered an error verifying email: ${err.message}`);
    const result: EmailResponse = { verified: false, verifyFailureReason: err.message };
    return res.json(result);
  }
};

export const verifyBusinessFEIN = (req: IReq<BusinessFEINBody>, res: IRes) => {
  const {
    body: {
      businessName,
      fein
    },
  } = req;
  try {
      // Regular expression to match FEIN format "XX-XXXXXXX" or "XXXXXXXXX"
      const feinRegex = /^(\d{2}-?\d{7})$/;

      if (!feinRegex.test(fein)) {
          throw new Error("Invalid FEIN format");
      }

      //Check data against sample database checking for format "XX-XXXXXXX" or "XXXXXXXXX"
      const businessRecord = SAMPLE_BUSINESS_DATABASE.find(b => b.fein.replace(/-/g, '') === fein.replace(/-/g, '') && b.businessName === businessName);
      if (!businessRecord) {
          throw new Error("FEIN and business name do not match any known records");
      }

      const result: BusinessFEINResponse = { verified: true }
      return res.json(result);

  } catch (err) {
      console.error(`Encountered an error verifying FEIN: ${err.message}`);
      const result: BusinessFEINResponse = { verified: false, verifyFailureReason: err.message };
      return res.json(result);
  }
};

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

      // Simulate a successful verification if the phone number format is correct
      const result: PhoneNumberResponse = { verified: true };
      return res.json(result);
  } catch (err) {
      console.log(`Encountered an error verifying phone number: ${err.message}`);
      const result: PhoneNumberResponse = { verified: false, verifyFailureReason: err.message };
      return res.json(result);
  }
};


export const verifySSN = (req: IReq<SSNBody>, res: IRes) => {
  const {
      body: {
          socialSecurityNumber,
          firstName,
          lastName,
          dateOfBirth
      },
  } = req;

  try {
      // Normalize the SSN by removing dashes
      const normalizedSSN = socialSecurityNumber.replace(/-/g, '');

      // Regular expression to match SSN format "XXXXXXXXX" after removing dashes
      const ssnRegex = /^\d{9}$/;

      if (!ssnRegex.test(normalizedSSN)) {
          throw new Error("Invalid SSN format");
      }

      // Normalize SSNs in the database similarly before comparison
      const personRecord = SAMPLE_SSN_DATABASE.find(person =>
          person.socialSecurityNumber.replace(/-/g, '') === normalizedSSN &&
          person.firstName === firstName &&
          person.lastName === lastName &&
          person.dateOfBirth === dateOfBirth
      );
      if (!personRecord) {
          throw new Error("No match found for provided SSN details");
      }

      const result: SSNResponse = { verified: true };
      return res.json(result);
  } catch (err) {
      console.log(`Encountered an error verifying SSN: ${err.message}`);
      const result: SSNResponse = { verified: false, verifyFailureReason: err.message };
      return res.json(result);
  }
};