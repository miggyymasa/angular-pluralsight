import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';

import { Customer } from './customer';

/**
 * We can the validator function above the component class. If
 * this validator will only be used by this component, it makes sense
 * to add it here.
 *
 * But if the validator could be use by other parts of the application,
 * consider instead putting it in its own file. It can then more easily
 * be reused by any component that needs it with a simple import statement.
 *
 */
/*function ctmValidatorRatingRange(c: AbstractControl): {[key: string]: boolean} | null {
  if(c.value !== null && (isNaN(c.value) || c.value < 1 || c.value > 5)) {
    return { 'range': true };
  }
  return null;
}*/

/**
 * Modifying a validator function to accept parameters requires wrapping the
 * validator function in a factory function. That factory function takes in
 * any desired parameters and returns the validator function.
 *
 * Then we modify the validator function to use those provided parameters.
 */
function ctmValidatorRatingRange(min: number, max: number): ValidatorFn {
  return (c: AbstractControl): { [key: string]: boolean } | null => {
    if (c.value !== null && (isNaN(c.value) || c.value < min || c.value > max)) {
      return { 'range': true };
    }
    return null;
  };
}

function emailMatcher(c: AbstractControl): { [key: string]: boolean } | null {
    const emailControl = c.get('email');
    const confirmControl = c.get('confirmEmail');

    if ( emailControl.pristine || confirmControl.pristine ){
      return null;
    }

    if ( emailControl.value === confirmControl.value ){
      return null;
    }

    return { 'match': true };
  }



@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customerForm: FormGroup;
  customer = new Customer(); //data model

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.customerForm = this.fb.group({
      firstName: ['', [Validators.minLength(3), Validators.required]],
      lastName: ['', [Validators.maxLength(50), Validators.required]],
      emailGroup: this.fb.group({
        email: ['', [Validators.email, Validators.required]],
        confirmEmail: ['', Validators.required],
      }, { Validator: emailMatcher }),
      phone: '',
      notification: 'email',
      rating: [null, ctmValidatorRatingRange],
      sendCatalog: [true]
    });
  }

  populateTestData(): void {
    this.customerForm.setValue({
      firstName: 'Miggy',
      lastName: 'Ymasa',
      email: 'email@test.com',
      sendCatalog: false,
    });
  }

  /** Adjusting Validation Rules at Runtime */
  setNotification(notifyVia: string): void {
    const phoneControl = this.customerForm.get('phone');

    if (notifyVia === 'text') {
      phoneControl.setValidators(Validators.required);
    } else {
      phoneControl.clearValidators();
    }

    phoneControl.updateValueAndValidity();
  }

  save() {
    console.log(this.customerForm);
    console.log('Saved: ' + JSON.stringify(this.customerForm.value));
  }
}
