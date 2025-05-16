
import { ValidatorFn, FormGroup, FormControl, AbstractControl, ValidationErrors } from "@angular/forms";

export function minRequiredCheckboxesSelected(min: number): ValidatorFn {
    
    return (formGroup: AbstractControl): ValidationErrors | null => {
      
        const totalSelected = Object.values((formGroup as FormGroup).controls)
        .map(value => value as FormControl)
        .filter(control => control.value === true).length;

      return totalSelected >= min ? null : { minSelected: {message : '¡Seleccionar como mínimo una opción para continuar!'} };
    };
}


