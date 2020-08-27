import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from './Post.model';

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
      .get<{
        message: string;
        posts: {
          _id: string;
          title: string;
          content: string;
          imagePath: string;
        }[];
      }>(`${this.url}/api/posts`)
      .pipe(
        map((postData) => {
          return postData.posts.map((post) => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath,
            };
          });
        })
      )
      .subscribe((posts) => {
        this.posts = posts;
        this.postsUpdated.next([...this.posts]);
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

  getPostUpdateListener(): Observable<Post[]> {
    return this.postsUpdated.asObservable();
  }

  deletePost(id: string): void {
    this.http.delete(`${this.url}/api/posts/${id}`).subscribe((res) => {
      this.posts = this.posts.filter((p) => p.id !== id);
      this.postsUpdated.next([...this.posts]);
    });
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
        newPost = { ...newPost, id: res.post._id };
        this.posts.push(newPost);
        this.postsUpdated.next([...this.posts]);
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
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(
          (p) => p.id === editedPost.id
        );
        const post: Post = { ...editedPost, imagePath: image as string };
        updatedPosts[oldPostIndex] = editedPost;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }
}
