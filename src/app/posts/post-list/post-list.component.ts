import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

import { Subscription } from 'rxjs';

import { Post } from '../Post.model';

import { AuthService } from './../../auth/auth.service';

import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  subscriptions: Subscription[] = [];
  isAuthenticated = false;
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];

  constructor(
    private postsService: PostsService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.subscriptions.push(
      this.postsService.getPostUpdateListener().subscribe((postsData) => {
        this.posts = postsData.posts;
        this.totalPosts = postsData.postCount;
        this.isLoading = false;
      })
    );
    this.isAuthenticated = this.authService.getIsAuthenticated();
    this.subscriptions.push(
      this.authService.getAuthStatusListener$().subscribe((isAuthenticated) => {
        this.isAuthenticated = isAuthenticated;
      })
    );
  }

  onDelete(id: string): void {
    this.isLoading = true;
    this.postsService.deletePost(id).subscribe((res) => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  onChangedPage(pageData: PageEvent): void {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
