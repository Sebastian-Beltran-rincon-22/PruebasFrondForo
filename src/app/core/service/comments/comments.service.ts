import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  private apiUrl = 'https://pooforoapi.onrender.com/'
  constructor(private http: HttpClient) { }

  createComment(data:any):Observable<any>{
    return this.http.post(`${this.apiUrl}comments/create`,data)
  }

  getComments(publicationId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}comments/publication/${publicationId}`);
  }
}
