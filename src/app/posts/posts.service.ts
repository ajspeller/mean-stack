import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from './Post.model';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();
  private posts: Post[] = [];
  private url = 'http://localhost:3000';

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number): void {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{
        message: string;
        posts: {
          _id: string;
          title: string;
          content: string;
          imagePath: string;
        }[];
        maxPosts: number;
      }>(`${this.url}/api/posts${queryParams}`)
      .pipe(
        map((postData) => {
          return {
            posts: postData.posts.map((post) => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
              };
            }),
            maxPosts: postData.maxPosts,
          };
        })
      )
      .subscribe((postsData) => {
        this.posts = postsData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: postsData.maxPosts,
        });
      });
  }

  getPost(id: string): Observable<Post> {
    return this.http
      .get<{
        message: string;
        post: {
          _id: string;
          title: string;
          content: string;
          imagePath: string;
        };
      }>(`${this.url}/api/posts/${id}`)
      .pipe(
        map((res) => {
          const { _id, title, content, imagePath } = res.post;
          return { id: _id, title, content, imagePath };
        })
      );
  }

  getPostUpdateListener(): Observable<{ posts: Post[]; postCount: number }> {
    return this.postsUpdated.asObservable();
  }

  deletePost(id: string): Observable<any> {
    return this.http.delete(`${this.url}/api/posts/${id}`);
  }

  addPost(newPost: Post, image: File): void {
    const postData = new FormData();
    postData.append('id', newPost.id);
    postData.append('title', newPost.title);
    postData.append('content', newPost.content);
    postData.append('image', image, newPost.title);
    this.http
      .post<{
        message: string;
        post: {
          _id: string;
          title: string;
          content: string;
          imagePath: string;
        };
      }>(`${this.url}/api/posts`, postData)
      .subscribe((res) => {
        this.router.navigate(['/']);
      });
  }

  updatePost(editedPost: Post, image: File | string): void {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('title', editedPost.title);
      postData.append('content', editedPost.content);
      postData.append('image', image, editedPost.title);
    } else {
      postData = { ...editedPost, imagePath: image } as Post;
    }

    this.http
      .put(`${this.url}/api/posts/${editedPost.id}`, postData)
      .subscribe((res) => {
        this.router.navigate(['/']);
      });
  }
}
