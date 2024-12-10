import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../model/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http:HttpClient) {}

  //Gat all post
  getPosts():Observable<Post[]>{
    return this.http.get<Post[]>("");
  }

  //get single post by id
  getPost(id: string):Observable<Post>{
    return this.http.get<Post>("");
  }

  //Add new post
  createPost(post: Post):Observable<Post>{
    return this.http.post<Post>("", post);
  }

  //update post
  updatePost(post:Post):Observable<Post>{
    return this.http.put<Post>("", post);
  }

  //Delete post by id
  deletePost(id:string):void{
    this.http.delete<Post>("");
  }

}
