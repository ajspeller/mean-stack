import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { Post } from '../Post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  subscriptions: Subscription[] = [];
  isLoading = false;

  constructor(private postsService: PostsService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts();
    this.subscriptions.push(
      this.postsService.getPostUpdateListener().subscribe((posts) => {
        this.posts = posts;
        this.isLoading = false;
      })
    );
  }

  onDelete(id: string): void {
    this.postsService.deletePost(id);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
