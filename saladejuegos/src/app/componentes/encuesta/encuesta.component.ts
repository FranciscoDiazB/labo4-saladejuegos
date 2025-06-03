import { Component, inject, OnInit } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { minRequiredCheckboxesSelected } from './validators/requiredCheckboxes.validator';

@Component({
  selector: 'app-encuesta',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './encuesta.component.html',
  styleUrl: './encuesta.component.scss'
})
export class EncuestaComponent implements OnInit{

  supaBase = inject(SupabaseService);

  surveyForm!:FormGroup;
  gameGenres!:FormGroup;
  lastPart!:FormGroup;
  startSurvey:boolean = false;
  questionLength:string = '';

  ngOnInit(): void {

    this.surveyForm = new FormGroup({
      name: new FormControl(null, [Validators.pattern('^[a-zA-ZÀ-ÿ ]+$'), Validators.required]),
      surname: new FormControl(null, [Validators.pattern('^[a-zA-ZÀ-ÿ ]+$'), Validators.required]),
      age: new FormControl(null, [Validators.min(18), Validators.max(99) ,Validators.required]),
      phoneNumber: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(9999999999)]),
    });
  
    this.gameGenres = new FormGroup({
      shooter: new FormControl(false),
      sport: new FormControl(false),
      soulslike: new FormControl(false),
      puzzle: new FormControl(false),
      platform: new FormControl(false),
      simulation: new FormControl(false),
    }, minRequiredCheckboxesSelected(1));

    this.lastPart = new FormGroup({
      timePlayed: new FormControl(null, Validators.required),
      question: new FormControl(null, [Validators.pattern('^[a-zA-ZÀ-ÿ0-9 ]+$'), Validators.required])
    })

    this.surveyForm.addControl('gameGenres', this.gameGenres);
    this.surveyForm.addControl('playTime', this.lastPart);
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

  get justTimePlayed(){
    return this.lastPart.get('timePlayed');
  }

  get justQuestions(){
    return this.lastPart.get('question');
  }

  get justGameGenres(){
    return this.surveyForm.get('gameGenres');
  }

  startTheSurvey(){

    this.startSurvey = true;
  }

  submitFormToDatabase() {
    //console.log(this.surveyForm.value);
    this.saveDataGame();
  }

  saveDataGame(){

    const userLogin = this.supaBase.currentUser()?.email;

    this.supaBase.supabaseFunctions.schema('public').from('survey').insert([
      {user : userLogin, name: this.justName?.value, surname: this.justSurname?.value, age: this.justAge?.value,
        phone: this.justPhoneNumber?.value, genres: JSON.stringify(this.justGameGenres?.value), 
        minutesPlayed : this.justTimePlayed?.value, answer : this.justQuestions?.value
       }]).then(({data, error}) =>{
      if(error){
        console.log("Error al escribir en la BD");
        console.log(error.message);
      }
      else{
        console.log("Success");
      }
    });
    this.showSurveySaved();
  }

  showSurveySaved(){
    const element = document.getElementById("survey-saved");
    element?.classList.add('open-surveySaved');

    const element2 = document.getElementById("form-last-part");
    element2?.classList.remove('open-form')

  }

  removeSurveySaved(){
    const element = document.getElementById("survey-saved");
    element?.classList.remove('open-surveySaved');
  }

  changeForms(condition:string){

    const element = document.getElementById('form-first-part');
    const elemnt2 = document.getElementById('form-second-part');
    const element3 = document.getElementById('form-last-part');
    
    if(condition == 'firstToSecond'){
      element?.classList.add('close-form');
      elemnt2?.classList.add('open-form');
    }
    else if(condition == 'secondToLast'){
      elemnt2?.classList.remove('open-form');
      element3?.classList.add('open-form');
    }
    else if(condition == 'LastToSecond'){
      element3?.classList.remove('open-form');
      elemnt2?.classList.add('open-form');
    }
    else if(condition == 'secondToFirst')
    {
      elemnt2?.classList.remove('open-form');
      element?.classList.remove('close-form');
    }
  }
}
