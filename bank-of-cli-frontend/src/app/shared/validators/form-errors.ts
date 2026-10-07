import { AbstractControl } from '@angular/forms';

/**
 * Returns the first message to show under a field, or null.
 * Shows nothing until the user has left the field or submitted, per the style guide.
 */
export function fieldError(control: AbstractControl | null, submitted = false): string | null {
  if (!control || !control.errors || !(control.touched || submitted)) return null;
  const errors = control.errors;
  if (errors['required']) return 'This field is required.';
  if (errors['email']) return 'Enter an email like you@example.com.';
  if (errors['minlength']) return `Use at least ${errors['minlength'].requiredLength} characters.`;
  const first = Object.values(errors)[0];
  return typeof first === 'string' ? first : 'Check this field.';
}
