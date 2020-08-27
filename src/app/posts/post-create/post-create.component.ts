import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { Post } from './../Post.model';

import { PostsService } from './../posts.service';

import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss'],
})
export class PostCreateComponent implements OnInit {
  post: Post;
  form: FormGroup;
  isLoading = false;
  mode = 'create';
  imagePreview: string;
  private id: string;

  constructor(
    private postsService: PostsService,
    private router: Router,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(null, {
        validators: [Validators.required],
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });

    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params.has('id')) {
        this.isLoading = true;
        this.mode = 'edit';
        this.id = params.get('id');
        this.postsService.getPost(this.id).subscribe((p) => {
          this.post = p;
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath,
          });
          this.isLoading = false;
        });
      } else {
        this.mode = 'create';
        this.id = null;
      }
    });
  }

  onSavePost(): void {
    if (this.form.invalid) {
      return;
    }

    const { title, content, image } = this.form.value;
    const post: Post = {
      id: this.id,
      title,
      content,
      imagePath: null,
    };
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPost(post, image);
    } else {
      this.postsService.updatePost(post, image);
    }
    this.clearForm();
    this.router.navigate(['../']);
  }

  clearForm(): void {
    this.form.reset();
  }

  onImagePicked(event: Event): void {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
