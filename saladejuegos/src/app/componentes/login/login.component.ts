import { Component, linkedSignal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{

show:boolean = false;
email:string = "";
password:string = "";
errorMessage:string = "";
user:any = {
  
};

ngOnInit(): void {

  this.user.email = "a@yahoo.com.ar";
  this.user.password = "12345";

}

constructor(private router:Router){
}

userLogin(path:string){

  console.log(this.email);
  
  if(this.email == this.user.email && this.password == this.user.password){

    console.log(this.email);
    console.log(this.password);

    this.router.navigate([path]);
  }
}

showHidePassword() {
  this.show = !this.show;
}



}
