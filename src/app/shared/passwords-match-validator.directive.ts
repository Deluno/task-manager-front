import { Directive } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
  ValidatorFn,
} from '@angular/forms';

@Directive({
  selector: '[appPaswordsMatchValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PasswordsMatchValidatorDirective,
      multi: true,
    },
  ],
})
export class PasswordsMatchValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors {
    return paswordsMatchValidator(control);
  }
}

export const paswordsMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  return password && confirmPassword && password.value !== confirmPassword.value
    ? { passMatch: false }
    : null;
};
