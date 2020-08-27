import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { Post } from './../Post.model';

import { PostsService } from './../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss'],
})
export class PostCreateComponent implements OnInit {
  post: Post;

  isLoading = false;
  mode = 'create';
  private id: string;

  constructor(
    private postsService: PostsService,
    private router: Router,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params.has('id')) {
        this.isLoading = true;
        this.mode = 'edit';
        this.id = params.get('id');
        this.postsService.getPost(this.id).subscribe((p) => {
          this.post = p;
          this.isLoading = false;
        });
      } else {
        this.mode = 'create';
        this.id = null;
      }
    });
  }

  onAddPost(form: NgForm): void {
    const { id, title, content } = form.value;
    const post: Post = {
      id: this.id,
      title,
      content,
    };
    if (!title || !content) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPost(post);
    } else {
      this.postsService.updatePost(post);
    }
    this.clearForm(form);
    this.router.navigate(['../']);
  }

  clearForm(form: NgForm): void {
    form.resetForm();
  }
}
