import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {AuthInterface} from '../interfaces/auth.interface';
import {Observable, of} from 'rxjs';
import {map, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = environment.baseUrl;
  // tslint:disable-next-line:variable-name
  private _auth: AuthInterface | undefined;

  get auth(): AuthInterface {
    return {...this._auth!};
  }

  constructor(private http: HttpClient) {
  }

  verificaAutenticacion(): Observable<boolean>{
    if (!localStorage.getItem('token')) {
      return of(false);
    }
    return this.http.get<AuthInterface>(`${this.baseUrl}/usuarios/1`)
      .pipe(
        map(auth => {
          this._auth = auth;
          return true;
        })
      );
  }

  login():
    Observable<AuthInterface> {
    return this.http.get<AuthInterface>(`${this.baseUrl}/usuarios/1`)
      .pipe(
        tap(auth => this._auth = auth),
        tap(auth => localStorage.setItem('token', auth.id)),
      );
  };
}
