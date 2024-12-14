import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from 'src/app/model/post';

@Component({
  selector: 'app-post',
  imports: [CommonModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent {

  @Input() post!: Post;
  constructor(private router:Router){}

  // Method to navigate to the post view page
  onViewPost(){
    // Build a URL-friendly string from the post code and title
    const buildUrl = (this.post.code + ' ' + this.post.title)
    .toLocaleLowerCase()
    .replace(/ /g, '-')
    .replace(/'/g, '-');  
     // Navigate to the post view page using the constructed URL
    this.router.navigateByUrl(`posts/${buildUrl}`);
  }

// Method to navigate to the post edit page
  onEditPost(){
     // Navigate to the post edit page using the post code
    this.router.navigate([`posts/edit/${this.post.code}`])
  }

}
