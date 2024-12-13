import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { catchError } from 'rxjs';
import { Post } from 'src/app/model/post';
import { PostService } from 'src/app/service/post.service';
import { tap, of } from 'rxjs';

@Component({
  selector: 'app-post-form',
  imports: [ReactiveFormsModule],
  templateUrl: './post-form.component.html',
  styleUrl: './post-form.component.css'
})
export class PostFormComponent implements OnInit {
  post?:Post;
  postForm!:FormGroup;

  constructor(
    private fb:FormBuilder,
    private activatedRoute: ActivatedRoute,
    private postService:PostService
  ){
    this.initForm();
  }

  ngOnInit(): void {
    const code = this.activatedRoute.snapshot.params['code'];

    if(code){
      this.postService.getPost(code).subscribe(post =>{
        this.post = post;

        if (this.post) {
          this.postForm.patchValue({
            title: this.post.title,
            description: this.post.description,
          }); 
        }
      });
    }
  }
  private initForm():void{
    this.postForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      contents:this.fb.array([])
    });
  }
}
