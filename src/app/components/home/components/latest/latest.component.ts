import { Component, inject, signal } from '@angular/core';
import { DataService, Post } from '../../../../services/data.service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-latest',
  imports: [RouterLink],
  templateUrl: './latest.component.html',
  styleUrl: './latest.component.css',
})
export class LatestComponent {
 private readonly dataService = inject(DataService);
  readonly posts = signal<Post[]>([]);

  constructor() {
    this.dataService.getPosts().subscribe((posts: Post[]) => this.posts.set(posts.slice(3,6)));
  }
}
