import { Component, inject, signal, computed, HostListener, effect } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DataService, Post } from '../../services/data.service';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-search-modal',
  imports: [RouterLink],
  templateUrl: './search-modal.component.html',
  styleUrl: './search-modal.component.css'
})
export class SearchModalComponent {
  private readonly dataService = inject(DataService);
  private readonly router = inject(Router);
  readonly searchService = inject(SearchService);

  readonly isOpen = this.searchService.isOpen;
  readonly query = signal('');
  readonly posts = signal<Post[]>([]);

  readonly filteredPosts = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return [];
    return this.posts().filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q))
    );
  });

  constructor() {
    this.dataService.getPosts().subscribe((p) => this.posts.set(p));
    effect(() => {
      if (this.isOpen()) {
        this.query.set('');
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
  }

  open() {
    this.searchService.open();
  }

  close() {
    this.searchService.close();
  }

  selectPost(slug: string) {
    this.close();
    this.router.navigate(['/blog', slug]);
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.close();
  }
}
