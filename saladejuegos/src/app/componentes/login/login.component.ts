import { Component, linkedSignal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { createClient } from '@supabase/supabase-js'

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent implements OnInit{

supabase = createClient('https://didagcbnjmwdbhqgvlbc.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpZGFnY2Juam13ZGJocWd2bGJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3NDIxMTMsImV4cCI6MjA2MDMxODExM30.LPeNC1gkCkNgpwXPOiFfmqPg2BxZKQ3E7qqlJ5cqWJ4');

show:boolean = false;
email:string = "";
password:string = "";
errorNumber:number = 0;

ngOnInit(): void {

}

constructor(private router:Router){
}

userLogin(path:string){

  this.supabase.auth.signInWithPassword({
    email: this.email,
    password: this.password
  }).then(({data, error}) => {
    if(error){

      console.error('Error', error.message);
      
      if(error.message == 'missing email or phone'){
        this.errorNumber = 1; 
      }
      else if(error.message == 'Invalid login credentials'){
        this.errorNumber = 2;
      }

    const element = document.getElementById("msgEr");
    element?.classList.add('open-msgError');   
    }
    else{
      this.router.navigate([path]);
    }
  })
}

completeUser(user:string){

  if(user =='uno'){
    this.email = 'userone@gmail.com';
    this.password = 'userone1';
  }
  else{
    this.email = 'usertwo@gmail.com';
    this.password = 'usertwo2';
  }
}

showHidePassword() {
  this.show = !this.show;
}

cerrarMensaje(){
      const element = document.getElementById("msgEr");
      element?.classList.remove('open-msgError');
}

}
