import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from './posts.model';
import { Router } from '@angular/router';


@Injectable({ providedIn: 'root'})
export class PostsService {
    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>();

    constructor(private http: HttpClient, private router: Router) {

    }

    getPosts() {
        this.http.get<{message: string, posts: any }>('http://localhost:3000/api/posts')
        .pipe(map((postData) => {
            return postData.posts.map(post => {
                return {
                    title: post.title,
                    content: post.content,
                    id: post._id,
                    imagePath: post.imagePath
                };
            });
        }))
        .subscribe((transformedPosts) => {
            this.posts = transformedPosts;
            this.postsUpdated.next([...this.posts]); // post update is a clone of the posts array
        });

    }

    getPostUpdateListener() {
        return this.postsUpdated.asObservable();
    }

    getPost(id: string){
        // return {...this.posts.find(p => p.id === id)};

        return this.http.get<{ _id: string, title: string, content: string }>('http://localhost:3000/api/posts/' + id);
    }

    addPost(title: string, content: string, image: File) {
        //const post: Post = {id: null, title, content};

        const postData =  new FormData();
        postData.append('title', title);
        postData.append('content', content);
        postData.append('image', image, title);


        this.http
        .post<{ message: string, post: Post}>(
          'http://localhost:3000/api/posts',
           postData)
        .subscribe((res) => {
            const post: Post = {
              id: res.post.id,
              title: title,
              content:content,
              imagePath: res.post.imagePath
             } ;
            this.posts.push(post);
            this.postsUpdated.next([...this.posts]);
            this.router.navigate(['/']);
        });
    }

    updatePost(id: string, title: string, content: string) {
        const post: Post = {id, title, content, imagePath: null};
        this.http
        .put<{ message: string }>('http://localhost:3000/api/posts/' + id , post)
        .subscribe( result => {

            // clone initial posts array
            const updatedPosts = [...this.posts];
            // find index of updated post in the initial posts array
            const oldPostIndex = updatedPosts.findIndex( p => p.id === post.id);
            // update posts array with the updated array
            updatedPosts[oldPostIndex] = post;
            this.posts = updatedPosts;
            this.postsUpdated.next([...this.posts]);
            this.router.navigate(['/']);
        });
    }

    deletePost(postID: string){
        this.http.delete<{ message: string }>('http://localhost:3000/api/posts/' + postID)
        .subscribe(() => {
            const updatedPosts = this.posts.filter(post => post.id !== postID);
            this.posts = updatedPosts;
            this.postsUpdated.next([...this.posts]);
        });
    }
}
