export const validationRules = {
  firstName: {
    required: true,
    pattern: /^[A-Za-z]{2,50}$/,
    message: 'First name must be 2-50 letters only',
  },
  lastName: {
    required: true,
    pattern: /^[A-Za-z]{2,50}$/,
    message: 'Last name must be 2-50 letters only',
  },
  supervisorEmail: {
    required: true,
    pattern: /^[a-zA-Z0-9._%+-]+@the4d\.ca$/,
    message: 'Must be a valid @the4d.ca email',
  },
  employeeId: {
    required: true,
    pattern: /^[A-Z]{3}-\d{5}$/,
    message: 'Format: ABC-12345',
  },
  phoneNumber: {
    required: true,
    pattern: /^\+1 \(\d{3}\) \d{3}-\d{4}$/,
    message: 'Format: +1 (555) 555-5555',
  },
  salary: {
    required: true,
    pattern: /^[1-9]\d*$/,
    message: 'Must be a positive number',
  },
  startDate: {
    required: true,
    message: 'Start date is required',
  },
  costCenter: {
    required: true,
    pattern: /^[A-Z]{2}-\d{3}-[A-Z]{3}$/,
    message: 'Format: AB-123-ABC',
  },
  projectCode: {
    required: true,
    pattern: /^PRJ-\d{4}-\d{3}$/,
    message: 'Format: PRJ-YEAR-001',
  },
};
