import { Component, inject, OnInit } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-encuesta',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './encuesta.component.html',
  styleUrl: './encuesta.component.scss'
})
export class EncuestaComponent implements OnInit{

  supaBase = inject(SupabaseService);

  surveyForm!: FormGroup;
  flagButton:boolean = false;

  ngOnInit(): void {

    
    this.surveyForm = new FormGroup({
      name: new FormControl(null, [Validators.pattern('^[a-zA-ZÀ-ÿ ]+$'), Validators.required]),
      surname: new FormControl(null, [Validators.pattern('^[a-zA-ZÀ-ÿ ]+$'), Validators.required]),
      age: new FormControl(null, [Validators.min(18), Validators.max(99) ,Validators.required]),
      phoneNumber: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(9999999999)]),
    });
  }

  get justName() {
    return this.surveyForm.get('name');
  }

  get justSurname() {
    return this.surveyForm.get('surname');
  }

  get justAge() {
    return this.surveyForm.get('age');
  }

  get justPhoneNumber() {
    return this.surveyForm.get('phoneNumber');
  }

  changeButtonBorder(condition:boolean){

    const element = document.getElementById('form-first-part');
    const elemnt2 = document.getElementById('form-second-part');
    
    if(condition){
      element?.classList.add('close-form');
      elemnt2?.classList.add('open-form');
    }
    else{
      element?.classList.remove('close-form');
      elemnt2?.classList.remove('open-form');
    }
  }

  enviarForm() {

    console.log(this.surveyForm.value);
  }

}
