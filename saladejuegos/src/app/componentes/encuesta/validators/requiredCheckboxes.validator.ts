
import { ValidatorFn, FormGroup, FormControl, AbstractControl, ValidationErrors } from "@angular/forms";

export function minRequiredCheckboxesSelected(min: number): ValidatorFn {
    
    return (formGroup: AbstractControl): ValidationErrors | null => {

        const errorMessage = {minSelected : '¡Seleccionar como mínimo una opción para continuar!'};
      
        const totalSelected = Object.values((formGroup as FormGroup).controls)
        .map(value => value as FormControl)
        .filter(control => control.value === true).length;

        if(totalSelected < min){

          formGroup.get('gameGenres')?.setErrors(errorMessage);

          return errorMessage;
        }
        else{
          return null;
        }
    };
}


