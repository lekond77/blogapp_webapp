import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError } from 'rxjs';
import { Post } from 'src/app/model/post';
import { PostService } from 'src/app/service/post.service';
import { tap, of } from 'rxjs';
import { NgFor, NgIf } from '@angular/common';
import { Content } from 'src/app/model/content';

@Component({
  selector: 'app-post-form',
  imports: [ReactiveFormsModule, NgIf, NgFor],
  templateUrl: './post-form.component.html',
  styleUrl: './post-form.component.css'
})
export class PostFormComponent implements OnInit {
  post?:Post;
  postForm!:FormGroup;
  formFeedback!:string|undefined;
  actionText!:string;

  constructor(
    private fb:FormBuilder,
    private activatedRoute: ActivatedRoute,
    private postService:PostService,
    private router:Router
  ){
    this.initForm();
  }

  ngOnInit(): void {
    const code = this.activatedRoute.snapshot.params['code'];

    if(code){
      this.postService.getPost(code).subscribe(post =>{
        this.post = post;

        if (this.post) {
         this.prefillForm(this.post);
        }
      });
    }
  }
  private initForm():void{
    this.postForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      contentBlock:this.fb.array([])
    });
  }

  prefillForm(post:Post): void {
  
      this.postForm.patchValue({
        title: post.title,
        description: post.description
      });
      if (post.contentBlock) {
          post.contentBlock.forEach(contentBlock => {
          const contentBlockGroup = this.fb.group({
            title: [contentBlock.title, Validators.required],
            contents: this.fb.array([])
          });

          contentBlock.contents.forEach(content => {
            this.addContentToContentBlock(contentBlockGroup, content);
          });

          this.contentBlocks.push(contentBlockGroup);
        });
      }
    
  }
  

  get contentBlocks():FormArray{
    return this.postForm.get('contentBlock') as FormArray;
  }

  addContentBlock(){
    const contentBlock = this.fb.group({
      title: ['', Validators.required],
      contents: this.fb.array([])
    });

    this.contentBlocks.push(contentBlock);
  }

  getContents(contentBlockIndex:number):FormArray{
    return this.contentBlocks.at(contentBlockIndex).get('contents') as FormArray;
  }

  addContentToContentBlock(contentBlockGroup:FormGroup, content?:Content){
    const contentsArray = contentBlockGroup.get('contents') as FormArray;
    contentsArray.push(this.fb.group({
      type:[content?.type || 'text', Validators.required],
      value:[content?.value || '', Validators.required]
    }));
  }

  addContent(contentBlockIndex: number): void {
    const contentsArray = this.getContents(contentBlockIndex);
    contentsArray.push(this.fb.group({
      type: ['text', Validators.required],
      value: ['', Validators.required]
    }));
  }

  onDeleteBlock(contentBlockIndex: number){
    this.contentBlocks.removeAt(contentBlockIndex);
  }
 onDeleteContent(contentBlockIndex: number, contentIndex: number): void {
    const contentsArray = this.getContents(contentBlockIndex);
    contentsArray.removeAt(contentIndex);
  }

  

  
  onSubmitForm(){
    if(this.postForm.valid){
      const postData = this.postForm.value;

      let request;

      if(this.post){
        request = this.postService.updatePost(this.post.code, postData);
        this.actionText = 'modifé';
      }else{
        request = this.postService.createPost(postData);
        this.actionText = 'ajouté';
        this.initForm();
      }

      request.pipe(
        tap((post) =>{
          this.formFeedback = `Post ${this.actionText} avec succès`;
          this.post = post;
        }),
        catchError((error) =>{
          return of (null)
        })
      ).subscribe();
      
    }
  }
  onDeletePost(code:string){
    this.postService.deletePost(code).subscribe();
    this.router.navigateByUrl('');
  }
}
