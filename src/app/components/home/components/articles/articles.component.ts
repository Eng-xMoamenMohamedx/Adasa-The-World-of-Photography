import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataService, Post } from '../../../../services/data.service';

@Component({
  selector: 'app-articles',
  imports: [RouterLink],
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.css',
})
export class ArticlesComponent {
  private readonly dataService = inject(DataService);
  readonly posts = signal<Post[]>([]);

  constructor() {
    this.dataService.getPosts(3).subscribe((posts: Post[]) => this.posts.set(posts));
  }
}
