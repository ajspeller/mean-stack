import { Injectable } from '@angular/core';

import { Subject, Observable } from 'rxjs';

import { Post } from './Post.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private postsUpdated = new Subject<Post[]>();
  private posts: Post[] = [];
  private url = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getPosts(): void {
    this.http
      .get<{ message: string; posts: Post[] }>(`${this.url}/api/posts`)
      .subscribe((res) => {
        this.posts = res.posts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener(): Observable<Post[]> {
    return this.postsUpdated.asObservable();
  }

  addPost(newPost: Post): void {
    this.http.post<any>(`${this.url}/api/posts`, newPost).subscribe((res) => {
      this.posts.push(newPost);
      this.postsUpdated.next([...this.posts]);
    });
  }
}
