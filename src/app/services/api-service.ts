import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../models/User";
import {LoginResponse} from "../models/LoginObject";
import {RegisterResponse} from "../models/RegisterObject";
import {EtiquetteEvent} from "../models/EtiquetteEvent";
import {Post} from "../models/Post";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/getAllUsers`);
  }

  checkUserExists(username: string, email: string): Observable<Boolean>{
    return this.http.post<boolean>(`${this.baseUrl}/checkUserExists`, {username, email});
  }

  addUser(id: string, firstName: string, lastName: string,
          email: string, phone: string, password: string): Observable<RegisterResponse> {
    const user = {id, firstName, lastName, email, phone, password};
    return this.http.post<RegisterResponse>(`${this.baseUrl}/addUser`, user);
  }

  loginUser(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, {username, password}, { withCredentials: true });
  }

  requestPasswordReset(email: string) {
    return this.http.post<number>(`${this.baseUrl}/requestPasswordReset`, email);
  }

  resetPassword(token: string, password: string) {
    return this.http.post(`${this.baseUrl}/resetPassword`, { token, password }, { responseType: 'text' });
  }

  getMe(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/me`, { withCredentials: true });
  }

  updateUser(userId: string, firstName: string, lastName: string) {
    return this.http.post(`${this.baseUrl}/updateUser`, {userId, firstName, lastName}, { responseType: 'text' });
  }

  uploadProfilePicture(userId: string, file: Blob) {
    const formData = new FormData();
    formData.append('file', file, 'profile.jpg');
    formData.append('userId', userId);
    return this.http.post<{ url: string }>(`${this.baseUrl}/uploadProfilePicture`, formData);
  }

  getEvents(): Observable<EtiquetteEvent[]> {
    return this.http.get<EtiquetteEvent[]>(`${this.baseUrl}/events`);
  }

  bookEvent(eventId: string): Observable<EtiquetteEvent> {
    return this.http.post<EtiquetteEvent>(`${this.baseUrl}/events/${eventId}/book`, {});
  }

  getPosts(type?: number): Observable<Post[]> {
    const url = type !== undefined ? `${this.baseUrl}/posts?type=${type}` : `${this.baseUrl}/posts`;
    return this.http.get<Post[]>(url);
  }

  createPost(post: Partial<Post>): Observable<Post> {
    return this.http.post<Post>(`${this.baseUrl}/posts`, post);
  }

  uploadImage(file: Blob): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file, 'post-image.jpg');
    return this.http.post<{ url: string }>(`${this.baseUrl}/uploadImage`, formData);
  }

  createPortalSession(): Observable<{ url: string }> {
    return this.http.post<{ url: string }>(`${this.baseUrl}/stripe/portal`, {});
  }

  savePushToken(token: string) {
    return this.http.post(`${this.baseUrl}/savePushToken`, { token });
  }
}
