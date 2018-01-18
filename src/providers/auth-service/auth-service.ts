import { Injectable } from '@angular/core';

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthService {

  private user : any = null;

  constructor() { }
  
  login(user : any) : void {
    this.user = user;
  }

  logout() : void {
    this.user = null;
  }

  getUser() : any {
    return this.user;
  }
 
  authenticated() : boolean {
    return this.user != null;
  }
}
