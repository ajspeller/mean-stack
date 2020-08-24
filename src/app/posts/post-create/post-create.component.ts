import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Post } from './../Post.model';

import { PostsService } from './../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss'],
})
export class PostCreateComponent implements OnInit {
  constructor(private postsService: PostsService) {}

  ngOnInit(): void {}

  onAddPost(form: NgForm): void {
    const { title, content } = form.value;
    const post: Post = {
      id: null,
      title,
      content,
    };
    if (!title || !content) {
      return;
    }
    this.postsService.addPost(post);
    this.clearForm(form);
  }

  clearForm(form: NgForm): void {
    form.resetForm();
  }
}
