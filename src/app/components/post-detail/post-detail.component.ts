import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService, Post } from '../../services/data.service';

@Component({
  selector: 'app-post-detail',
  imports: [RouterLink],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css'
})
export class PostDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly dataService = inject(DataService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly post = signal<Post | null>(null);
  readonly relatedPosts = signal<Post[]>([]);
  readonly loaded = signal(false);
  readonly notFound = computed(() => this.loaded() && this.post() === null);

  constructor() {
    const slug = this.route.snapshot.paramMap.get('slug');
    this.dataService.getPostsData().subscribe((data) => {
      this.post.set(data.posts.find((p) => p.slug === slug) ?? null);
      this.loaded.set(true);
    });
    this.dataService.getRelatedPosts(slug ?? '', 3).subscribe((posts) => this.relatedPosts.set(posts));
  }

  getFormattedContent(content: string) {
    if (!content) return '';
    const parts = content.split(/\n\n+/);
    const html = parts
      .map((block) => {
        if (block.startsWith('## ')) {
          return `<h2 class="mt-4 mb-2">${block.slice(3)}</h2>`;
        }
        return `<p class="mb-3">${block.replace(/\n/g, '<br>')}</p>`;
      })
      .join('');
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
