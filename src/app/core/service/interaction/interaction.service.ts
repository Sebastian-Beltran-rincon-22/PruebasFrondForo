import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InteractionService {

  private apiUrl = 'https://pooforoapi.onrender.com/'
  constructor(private http: HttpClient) { }

  likePublication(publicationId: string):Observable<any>{
    return this.http.patch(`${this.apiUrl}interactions/update/${publicationId}`,{like: true})
  }

  unlikePublication(publicationId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}interactions/delete/${publicationId}`);
  }

  commentPublication(publicationId:string):Observable<any>{
    return this.http.patch(`${this.apiUrl}interactions/update/${publicationId}`,{comment: String})
  }
}
