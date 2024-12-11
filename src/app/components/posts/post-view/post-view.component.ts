import { AsyncPipe, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Post } from 'src/app/model/post';
import { PostService } from 'src/app/service/post.service';

@Component({
  selector: 'app-post-view',
  imports: [NgIf, AsyncPipe],
  templateUrl: './post-view.component.html',
  styleUrl: './post-view.component.css'
})
export class PostViewComponent implements OnInit{

  post$!:Observable<Post>;
  code!:string;
  constructor(private activatedRoute:ActivatedRoute, private router:Router, private postService:PostService){}

  ngOnInit(): void {
    const routerParam = this.activatedRoute.snapshot.params['id'].split("-");
    this.code = routerParam[0];
    this.post$ = this.postService.getPost(this.code);
    console.log(this.code);
  }

}
