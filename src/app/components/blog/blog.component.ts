import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DataService, Post, Category } from '../../services/data.service';
import { NewsletterComponent } from '../newsletter/newsletter.component';

@Component({
  selector: 'app-blog',
  imports: [RouterLink, NewsletterComponent],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent {
  private readonly dataService = inject(DataService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly posts = signal<Post[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly selectedCategory = signal<string | null>(null);

  readonly filteredPosts = computed(() => {
    const cat = this.selectedCategory();
    if (!cat) return this.posts();
    return this.posts().filter((p) => p.category === cat);
  });

  constructor() {
    this.dataService.getPosts().subscribe((posts) => this.posts.set(posts));
    this.dataService.getCategories().subscribe((cats) => this.categories.set(cats));
    this.route.queryParams.subscribe((params) => this.selectedCategory.set(params['category'] || null));
  }

  selectCategory(cat: string | null) {
    this.selectedCategory.set(cat);
    this.router.navigate([], { queryParams: cat ? { category: cat } : {} });
  }
}
