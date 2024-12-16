import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../model/post';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private apiUrl = API_CONFIG.apiUrl;

  constructor(private http:HttpClient) {}
  //Gat all post
  getPosts():Observable<Post[]>{
    return this.http.get<Post[]>(`${this.apiUrl}/posts`);
  }

  //get single post by id
  getPost(code: string):Observable<Post>{
    return this.http.get<Post>(`${this.apiUrl}/post/${code}`);
  }

  //Add new post
  // createPost(post: Post):Observable<Post>{
  //   return this.http.post<Post>(`${this.apiUrl}/post`, post);
  // }

  createPost(post: Post, files: File[],  fileIndices:number[]): Observable<Post> {
    const formData: FormData = this.postFormData(post, files, fileIndices);
    // formData.append('post', new Blob([JSON.stringify(post)], { type: 'application/json' }));
    
    // files.forEach((file, index) => {
    //   formData.append('files', file, file.name);
    // });
    
    return this.http.post<Post>(`${this.apiUrl}/post`, formData);
  }
  

  //update post
  updatePost(code:string, post:Post, files:File[], fileIndices:number[]):Observable<Post>{
    const formData:FormData = this.postFormData(post, files, fileIndices);
    return this.http.put<Post>(`${this.apiUrl}/post/${code}`, formData);
  }

  //Delete post by id
  deletePost(code:string):Observable<any>{
    return this.http.delete<Post>(`${this.apiUrl}/post/${code}`);
  }

  private postFormData(post:Post, files:File[], fileIndices:number[]):FormData{
    const formData: FormData = new FormData();
    formData.append('post', new Blob([JSON.stringify(post)], { type: 'application/json' }));
    
    files.forEach((file, index) => {
      formData.append('files', file, file.name);
    });
    formData.append('fileIndicesJson', new Blob([JSON.stringify(fileIndices)]));

    return formData;
  }
}
