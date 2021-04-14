import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent {

  constructor(private router: Router,
              private authService: AuthService
  ) {
  }

  login(): void {
    // ir a backend
    // un
    this.authService.login()
      .subscribe(authResponse => {
        console.log(authResponse);
        if (authResponse.id) {
          this.router.navigate(['./heroes']);
        }

      });

    //

  }
}
