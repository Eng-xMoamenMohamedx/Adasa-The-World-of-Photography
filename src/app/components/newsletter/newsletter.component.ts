import { Component, inject, signal } from '@angular/core';
import { DataService, Post } from '../../services/data.service';


@Component({
  selector: 'app-newsletter',
  imports: [],
  templateUrl: './newsletter.component.html',
  styleUrl: './newsletter.component.css'
})
export class NewsletterComponent {
 private readonly dataService = inject(DataService);
  readonly posts = signal<Post[]>([]);

  constructor() {
    this.dataService.getPosts(3).subscribe((posts: Post[]) => this.posts.set(posts));
  }
}
