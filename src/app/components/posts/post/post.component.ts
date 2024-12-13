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

  onViewPost(){
    const buildUrl = (this.post.code + ' ' + this.post.title)
    .toLocaleLowerCase()
    .replace(/ /g, '-')
    .replace(/'/g, '-');  
    this.router.navigateByUrl(`posts/${buildUrl}`);
  }

  onEditPost(){
    this.router.navigate([`posts/edit/${this.post.code}`])
  }

}
