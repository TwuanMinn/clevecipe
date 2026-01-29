// Form Validation Utilities
// Add your form validation logic here

export interface ValidationRule {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: string) => boolean;
    message?: string;
}

export function validateField(value: string, rules: ValidationRule): string | null {
    if (rules.required && !value) {
        return rules.message || 'This field is required';
    }

    if (rules.minLength && value.length < rules.minLength) {
        return rules.message || `Minimum ${rules.minLength} characters required`;
    }

    if (rules.maxLength && value.length > rules.maxLength) {
        return rules.message || `Maximum ${rules.maxLength} characters allowed`;
    }

    if (rules.pattern && !rules.pattern.test(value)) {
        return rules.message || 'Invalid format';
    }

    if (rules.custom && !rules.custom(value)) {
        return rules.message || 'Invalid value';
    }

    return null;
}

// Add more validation utilities as needed
