import { Component, OnInit } from '@angular/core';
import { Post } from '../posts.model';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  private postId: string;
  private mode = 'create';
  public post: Post;
 
  constructor( public postsService: PostsService, public route: ActivatedRoute, public router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.postsService.getPost(this.postId).subscribe( postData => {
          this.post = { id: postData._id, title: postData.title, content: postData.content };
          console.log('Post ya kuupdate...');
          console.log(postData);
        });

      } else {
        this.mode = 'create';
        this.postId = null;
        this.post = {id: null, title: null, content : 'Your content' };
      }
    });
  }

  onSavePost(form: NgForm) {
    if ( form.invalid ) {
      return;
    }

    if ( this.mode === 'create' ) {
      this.postsService.addPost(form.value.title, form.value.content);
    } else {
      this.postsService.updatePost(this.postId, form.value.title, form.value.content);
      return this.router.navigate(['/update/' + this.postId ]);
    }
    form.resetForm();
  }

}
