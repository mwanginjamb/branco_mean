import { Component, OnInit } from '@angular/core';
import { Post } from '../posts.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  public post: Post;
  form: FormGroup;
  private postId: string;
  imagePreview: any;
  private mode = 'create';



  constructor( public postsService: PostsService, public route: ActivatedRoute, public router: Router) { }

  ngOnInit() {

    this.form = new FormGroup({
      title: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)]}),
      content: new FormControl(null, {validators: [Validators.required]}),
      image: new FormControl(null, { validators: [Validators.required]})
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.postsService.getPost(this.postId).subscribe( postData => {
          this.post = { id: postData._id, title: postData.title, content: postData.content };
          //setting default form field values
          this.form.setValue({
            'title': this.post.title,
            'content': this.post.content
          });
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

  // function triggering file upload

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0]; // Type conversion to alert ts of a html input with a files prop
    // update value of a single form control- patch instead of set
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onSavePost() {
    if ( this.form.invalid ) {
      return;
    }

    if ( this.mode === 'create' ) {
      this.postsService.addPost(this.form.value.title, this.form.value.content);
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content);
    }
    this.form.reset();
  }

}
