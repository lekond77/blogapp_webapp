import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { Comment } from 'src/app/model/comment';
import { Post } from 'src/app/model/post';
import { SplitBySemicolonPipe } from 'src/app/pipe/splitbysemicolon.pipe';
import { PostService } from 'src/app/service/post.service';

@Component({
  selector: 'app-post-view',
  imports: [NgIf, NgFor, SplitBySemicolonPipe, ReactiveFormsModule, CommonModule],
  templateUrl: './post-view.component.html',
  styleUrl: './post-view.component.css'
})
export class PostViewComponent implements OnInit{

  code!:string;
  commentForm!:FormGroup;
  post!:Post;
  error!:string;

  constructor(private activatedRoute:ActivatedRoute, 
    private postService:PostService,
    private fb:FormBuilder){
      this.initForm();
    }

  ngOnInit(): void {
    const routerParam = this.activatedRoute.snapshot.params['code'].split("-");
    this.code = routerParam[0];
    this.postService.getPost(this.code).subscribe(
      (post:Post)=>{
        this.post = post;
      }
    );
  }

  initForm(){
    this.commentForm = this.fb.group({
      pseudo:['', Validators.required],
      comment:['', Validators.required]
    })
  }

  onSubmit(){
    if(this.commentForm.valid){
      this.postService.addCommentToPost(this.code, this.commentForm.value).pipe(
        tap((comment:Comment)=>{
          this.post.comments?.unshift(comment);
          this.commentForm.reset();
        })),
        catchError((error) =>{
          this.error = "Une erreur s'est produite lors de l'ajout du commentaire";
          return of(null);
        }
      ) 
    }
  }
}
