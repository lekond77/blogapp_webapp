import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Post } from '../model/post';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private apiUrl = API_CONFIG.apiUrl;

  private postToEdit$ = new BehaviorSubject<Post|null>(null);

  constructor(private http:HttpClient) {}

  setPostEdit(post:Post | null):void{
    this.postToEdit$.next(post);
  }
  //Gat all post
  getPosts():Observable<Post[]>{
    return this.http.get<Post[]>(`${this.apiUrl}/posts`);
  }

  //get single post by id
  getPost(code: string):Observable<Post>{
    return this.http.get<Post>(`${this.apiUrl}/post/${code}`);
  }

  //Add new post
  createPost(post: Post):Observable<Post>{
    return this.http.post<Post>(`${this.apiUrl}/post`, post);
  }

  //update post
  updatePost(code:string, post:Post):Observable<Post>{
    return this.http.put<Post>(`${this.apiUrl}/post/${code}`, post);
  }

  //Delete post by id
  deletePost(code:string):Observable<any>{
    return this.http.delete<Post>(`${this.apiUrl}/post/${code}`);
  }

}
