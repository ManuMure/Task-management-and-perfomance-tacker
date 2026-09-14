export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export interface PasswordCheck {
  valid: boolean;
  message?: string;
}

/**
 * Enforces: 8+ characters, at least one uppercase letter, one lowercase
 * letter, one number, and one special character. Checked here so both the
 * client (for instant feedback) and the API route (the check that actually
 * matters, since client-side validation can always be bypassed) agree.
 */
export function validatePassword(password: string): PasswordCheck {
  if (password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters." };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: "Password must include a lowercase letter." };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: "Password must include an uppercase letter." };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: "Password must include a number." };
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return { valid: false, message: "Password must include a special character." };
  }
  return { valid: true };
}