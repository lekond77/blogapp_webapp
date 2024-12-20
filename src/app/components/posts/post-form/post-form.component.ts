import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from 'src/app/model/post';
import { PostService } from 'src/app/service/post.service';
import { tap, of, catchError } from 'rxjs';
import { NgFor, NgIf, NgStyle } from '@angular/common';
import { Content } from 'src/app/model/content';

@Component({
  selector: 'app-post-form',
  imports: [ReactiveFormsModule, NgIf, NgFor, NgStyle],
  templateUrl: './post-form.component.html',
  styleUrl: './post-form.component.css'
})
export class PostFormComponent implements OnInit {
  post?: Post;
  postForm!: FormGroup; 
  formFeedback!: string | undefined; // Feedback message for form submission
  actionText!: string; // Text to indicate the action performed (e.g., added, modified)
  backgroundColor!:string;
  isUpdated!:false;
  isCollapsed: boolean[] = [];

  constructor(
    private fb: FormBuilder, 
    private activatedRoute: ActivatedRoute,
    private postService: PostService,
    private router: Router
  ) {
    this.initForm(); // Initialize the form when the component is created

    this.isCollapsed = this.contentBlocks.controls.map(() => false);
  }

  ngOnInit(): void {
    // Get the 'code' parameter from the route to determine if we're editing an existing post
    const code = this.activatedRoute.snapshot.params['code'];

    if (code) {
      // Fetch the post data from the server using the post code
      this.postService.getPost(code).subscribe(post => {
        this.post = post;

        // If the post data is successfully fetched, prefill the form with the post data
        if (this.post) {
          this.prefillForm(this.post);
        }
      });
    }
  }
  // Prefill the form with the data of an existing post
  prefillForm(post: Post): void {
    // Set the title and description fields with the post data
    this.postForm.patchValue({
      title: post.title,
      description: post.description
    });

    // If the post has content blocks, iterate through them and add them to the form
    if (post.contentBlock) {
      post.contentBlock.forEach(contentBlock => {
        // Create a form group for each content block
        const contentBlockGroup = this.fb.group({
          title: [contentBlock.title, Validators.required],
          contents: this.fb.array([]) 
        });

        // If the content block has contents, iterate through them and add them to the form
        if(contentBlock.contents){
          contentBlock.contents.forEach(content => {
            this.addContentToContentBlock(contentBlockGroup, content);
          });
        }
        // Add the content block group to the content blocks array
        this.contentBlocks.push(contentBlockGroup);
      });
    }
  }

  // Initialize the form with default values and validators
  private initForm(): void {
    this.postForm = this.fb.group({
      title: ['', [Validators.required]], 
      description: ['', [Validators.required]],
      contentBlock: this.fb.array([]), // Content blocks array to hold multiple content blocks
      comments:this.fb.array([])
    });
  }

  // Getter for the content blocks form array
  get contentBlocks(): FormArray {
    return this.postForm.get('contentBlock') as FormArray;
  }

  // Add a new content block to the form
  addContentBlock() {
    const contentBlock = this.fb.group({
      title: ['', Validators.required], 
      contents: this.fb.array([]) 
    });

    // Add the new content block group to the content blocks array
    this.contentBlocks.push(contentBlock);
  }

  // Getter for the contents form array of a specific content block
  getContents(contentBlockIndex: number): FormArray {
    return this.contentBlocks.at(contentBlockIndex).get('contents') as FormArray;
  }

  // Add a new content to a specific content block
  addContentToContentBlock(contentBlockGroup: FormGroup, content?: Content) {
    const contentsArray = contentBlockGroup.get('contents') as FormArray;
    // Add a new content group to the contents array
    contentsArray.push(this.fb.group({
      type: [content?.type || 'text', Validators.required], 
      value: [content?.value || ''],
      file:['']
    }));
  }

  // Add a new content to a specific content block by index
  addContent(contentBlockIndex: number): void {
    const contentsArray = this.getContents(contentBlockIndex);
    // Add a new content group to the contents array
    contentsArray.push(this.fb.group({
      type: ['text', Validators.required], 
      value: [''],
      file:[''] 
    }));
  }

  // Delete a content block by index
  onDeleteBlock(contentBlockIndex: number) {
    this.contentBlocks.removeAt(contentBlockIndex);
  }

  // Delete a content from a specific content block by index
  onDeleteContent(contentBlockIndex: number, contentIndex: number): void {
    const contentsArray = this.getContents(contentBlockIndex);
    contentsArray.removeAt(contentIndex);
  }


  //
  onFileChange(event: any, blockIndex: number, contentIndex: number) {
    const file = event.target.files[0]; 
    const content = this.getContents(blockIndex).at(contentIndex);

    content.patchValue({ file: file });
  }
  // Handle form submission
  onSubmitForm() {
    if (this.postForm.valid) {
      const postData = this.postForm.value; // Get the form data

      const files: File[] = [];
      const fileIndices: number[] = [];

      this.contentBlocks.controls.forEach((block, blockIndex) => {
        const contentBlock = block.get('contents') as FormArray;
        contentBlock.controls.forEach((content, contentIndex) => {
          if (content.get('file')?.value) {
              files.push(content.get('file')?.value);
              fileIndices.push(contentIndex);
          }
        });
      });
      let request;

      // Determine if we're updating an existing post or creating a new one
      if (this.post) {
        request = this.postService.updatePost(this.post.code, postData, files, fileIndices);
        this.actionText = 'modifié'; // Set the action text to 'Modifié'
      } else {
        request = this.postService.createPost(postData, files, fileIndices);
        this.actionText = 'ajouté'; // Set the action text to 'Ajouté'
      }

      // Subscribe to the request to handle the response
      request.pipe(
        tap((post:Post) => {
          // Set the feedback message with the action text
          this.formFeedback = `Post ${this.actionText} avec succès`;
          this.backgroundColor = 'green';
          this.post = post; // Update the post data
        }),
        catchError((error) => {
          this.formFeedback = `Une erreur s'est produite`;
          this.backgroundColor = 'red'
          return of(null); // Handle errors gracefully
        })
      ).subscribe();
    }
  }

  // Delete a post by code and navigate to the home page
  onDeletePost(code: string) {
    this.postService.deletePost(code).subscribe(
      () => {
        this.router.navigateByUrl('');
      }
    );
  }

  toggleCollapse(index: number) {
    this.isCollapsed[index] = !this.isCollapsed[index];
  }
  
}
