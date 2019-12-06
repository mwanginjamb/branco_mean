import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';


import { Post } from '../posts.model';
import { PostsService } from '../posts.service';
<<<<<<< HEAD
=======

>>>>>>> 698de2462d1f16f9344479344adee31f38c89b07

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
<<<<<<< HEAD
export class PostListComponent implements OnInit {



  posts: Post[] = [];

  constructor(public postsService: PostsService) {

   }

  ngOnInit() {

=======
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  private postsSub: Subscription;

  constructor( public postsService: PostsService) { }

  ngOnInit() {
    this.postsService.getPosts();
    this.postsSub = this.postsService.getPostUpdateListener()
        .subscribe((posts: Post[]) => {
          this.posts = posts;
        });
  }

  onDelete(postID: string){
    this.postsService.deletePost(postID);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
>>>>>>> 698de2462d1f16f9344479344adee31f38c89b07
  }

}
