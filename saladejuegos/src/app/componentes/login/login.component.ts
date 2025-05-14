import { Component, inject, linkedSignal, OnInit, Injectable } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent implements OnInit{

supaBase = inject(SupabaseService);

show:boolean = false;
email:string = "";
password:string = "";
errorNumber:number = 0;

ngOnInit(): void {
  
}

constructor(private router:Router){
}

userLogin(path:string):void{

  this.supaBase.login(this.email, this.password).subscribe((result) => {
    if(result.error){

      console.log(result.error.message);
      
      if(result.error.message == "Invalid login credentials"){
        this.errorNumber = 2;
      }
      else if(result.error.message == "missing email or phone"){
        this.errorNumber = 1;
      }

      const element = document.getElementById("msgEr");
      element?.classList.add('open-msgError');   
    }
    else{

      const userLogin = this.supaBase.currentUser()?.email;

      this.supaBase.supabaseFunctions.schema('public').from('logsLogin').insert([{user : userLogin}]).then(({data , error}) => {
        if(error){
          console.log("Error al escribir en la BD");
          console.log(userLogin);
          console.log(error.message);
        }
        else{
          this.router.navigate([path]);
        }
      });

    }
  })
}

redirtcToRegister(path:string){
  this.router.navigate([path]);
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
