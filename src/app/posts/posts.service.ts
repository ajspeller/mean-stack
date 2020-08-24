import { Injectable } from '@angular/core';

import { Subject, Observable } from 'rxjs';

import { Post } from './Post.model';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private postsUpdated = new Subject<Post[]>();
  private posts: Post[] = [];

  constructor() {}

  getPosts(): Post[] {
    return [...this.posts];
  }

  getPostUpdateListener(): Observable<Post[]> {
    return this.postsUpdated.asObservable();
  }

  addPost(newPost: Post): void {
    this.posts.push(newPost);
    this.postsUpdated.next([...this.posts]);
  }
}
