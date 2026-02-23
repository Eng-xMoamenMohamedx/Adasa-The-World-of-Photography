import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError, tap } from 'rxjs';
import { NetworkStatusService } from './network-status.service';

export interface Post {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: { name: string; avatar: string; role: string };
  image: string;
  date: string;
  readTime: string;
  featured: boolean;
  tags: string[];
}

export interface Category {
  name: string;
  count: number;
  color: string;
}

export interface SiteInfo {
  name: string;
  tagline: string;
  description: string;
  email: string;
  social: Record<string, string>;
}

export interface PostsData {
  posts: Post[];
  categories: Category[];
  siteInfo: SiteInfo;
}

export interface SiteStats {
  postsCount: number;
  categoriesCount: number;
  authorsCount: number;
}

@Injectable({ providedIn: 'root' })
export class DataService {
  private readonly http = inject(HttpClient);
  private readonly networkStatus = inject(NetworkStatusService);

  private cachedData: PostsData | null = null;
  private fetchAttempted = false;

  getPostsData(): Observable<PostsData> {
    if (!this.networkStatus.canFetch()) {
      return of(this.cachedData ?? { posts: [], categories: [], siteInfo: this.getDefaultSiteInfo() });
    }
    if (this.cachedData) {
      return of(this.cachedData);
    }
    this.fetchAttempted = true;
    return this.http.get<PostsData>('assets/posts.json').pipe(
      tap((data) => (this.cachedData = data)),
      catchError(() => of(this.cachedData ?? { posts: [], categories: [], siteInfo: this.getDefaultSiteInfo() }))
    );
  }

  getPostBySlug(slug: string): Post | null {
    return this.cachedData?.posts.find((p) => p.slug === slug) ?? null;
  }

  getPosts(limit?: number, category?: string): Observable<Post[]> {
    return new Observable((subscriber) => {
      this.getPostsData().subscribe((data) => {
        let posts = data.posts;
        if (category) posts = posts.filter((p) => p.category === category);
        if (limit) posts = posts.slice(0, limit);
        subscriber.next(posts);
        subscriber.complete();
      });
    });
  }

  getStats(): Observable<SiteStats> {
    return new Observable((subscriber) => {
      this.getPostsData().subscribe((data) => {
        const authors = new Set(data.posts.map((p) => p.author.name));
        subscriber.next({
          postsCount: data.posts.length,
          categoriesCount: data.categories.length,
          authorsCount: authors.size
        });
        subscriber.complete();
      });
    });
  }

  getRelatedPosts(currentSlug: string, limit = 3): Observable<Post[]> {
    return new Observable((subscriber) => {
      this.getPostsData().subscribe((data) => {
        const current = data.posts.find((p) => p.slug === currentSlug);
        if (!current) {
          subscriber.next(data.posts.slice(0, limit));
          subscriber.complete();
          return;
        }
        const related = data.posts
          .filter((p) => p.slug !== currentSlug && (p.category === current.category || p.tags?.some((t) => current.tags?.includes(t))))
          .slice(0, limit);
        if (related.length < limit) {
          const ids = new Set(related.map((r) => r.id));
          data.posts.filter((p) => !ids.has(p.id) && p.slug !== currentSlug).slice(0, limit - related.length).forEach((p) => related.push(p));
        }
        subscriber.next(related);
        subscriber.complete();
      });
    });
  }

  getCategories(): Observable<Category[]> {
    return new Observable((subscriber) => {
      this.getPostsData().subscribe((data) => {
        subscriber.next(data.categories);
        subscriber.complete();
      });
    });
  }

  getUniqueAuthors(): Observable<{ name: string; avatar: string; role: string }[]> {
    return new Observable((subscriber) => {
      this.getPostsData().subscribe((data) => {
        const seen = new Set<string>();
        const authors = data.posts
          .map((p) => p.author)
          .filter((a) => {
            if (seen.has(a.name)) return false;
            seen.add(a.name);
            return true;
          });
        subscriber.next(authors);
        subscriber.complete();
      });
    });
  }

  getSiteInfo(): Observable<SiteInfo> {
    return new Observable((subscriber) => {
      this.getPostsData().subscribe((data) => {
        subscriber.next(data.siteInfo);
        subscriber.complete();
      });
    });
  }

  private getDefaultSiteInfo(): SiteInfo {
    return {
      name: 'عدسة',
      tagline: 'عالم التصوير الفوتوغرافي',
      description: 'مدونة متخصصة في فن التصوير الفوتوغرافي',
      email: 'hello@adasah.com',
      social: {}
    };
  }
}
