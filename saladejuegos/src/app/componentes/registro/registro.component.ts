import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registro',
  imports: [FormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})
export class RegistroComponent {

  supaBase = inject(SupabaseService);

  constructor(private router:Router){
  
  }
  
  email:string = "";
  password:string = "";
  errorNumber:number = 0;

  redirctToLogin(path:string){

    this.router.navigate([path]);
  }

  userRegister(path:string):void{

    this.supaBase.register(this.email, this.password).subscribe((result) => {
      if(result.error){
  
        console.log(result.error.message);

        switch(result.error.message){
          case "Anonymous sign-ins are disabled":
            this.errorNumber = 1;
            break;
          
          case "Signup requires a valid password":
            this.errorNumber = 2;
            break;

          case "User already registered":
            this.errorNumber = 3;
            break;

          case "Password should be at least 6 characters.":
            this.errorNumber = 4;
            break;
        }
  
        const element = document.getElementById("msgEr");
        element?.classList.add('open-msgError');   
      }
      else{
        this.router.navigate([path]);
      }
    })
  }

  cerrarMensaje(){
    const element = document.getElementById("msgEr");
    element?.classList.remove('open-msgError');
  }

}
