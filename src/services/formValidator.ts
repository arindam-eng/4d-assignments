import { validationRules } from '@/lib/validationRules';
import { FormData } from '@/types';

export const validateField = (name: string, value: any) => {
  console.log(name, value);
  const rule = validationRules[name as keyof typeof validationRules];
  if (!rule) return '';

  if (!value || (rule.required && !value.trim())) {
    return 'This field is required';
  }

  if ('pattern' in rule && !rule.pattern.test(value.trim())) {
    return rule.message;
  }

  return ''; // No error
};

export const validateForm = (formData: FormData) => {
  const errors: Record<string, string> = {};
  Object.keys(formData).forEach((field) => {
    console.log('field', field);
    const error = validateField(field, formData[field as keyof FormData]);
    if (error) errors[field] = error;
  });
  return errors;
};
