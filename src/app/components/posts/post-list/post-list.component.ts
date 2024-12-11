import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PostService } from 'src/app/service/post.service';
import { Post } from 'src/app/model/post';
import { PostComponent } from "../post/post.component";
import { AsyncPipe, NgFor } from '@angular/common';
@Component({
  selector: 'app-post-list',
  imports: [PostComponent, AsyncPipe, NgFor],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})
export class PostListComponent implements OnInit{

  posts$!:Observable<Post[]>;

  constructor(private postService:PostService){}

  ngOnInit(): void {
    this.posts$ = this.postService.getPosts();
  }
}
