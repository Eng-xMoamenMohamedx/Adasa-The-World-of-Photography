import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataService, SiteInfo } from '../../services/data.service';

export interface Author {
  name: string;
  avatar: string;
  role: string;
}

export interface ValueItem {
  icon: string;
  title: string;
  desc: string;
}

@Component({
  selector: 'app-about',
  imports: [RouterLink],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  private readonly dataService = inject(DataService);
  readonly siteInfo = signal<SiteInfo | null>(null);
  readonly authors = signal<Author[]>([]);
  readonly stats = signal({ readers: '+2مليون', posts: '+500', authors: '+50', categories: '+15' });

  readonly values: ValueItem[] = [
    { icon: 'fa-solid fa-bullseye', title: 'الجودة أولاً', desc: 'محتوى مدروس ومكتوب بخبرة' },
    { icon: 'fa-solid fa-bolt', title: 'تركيز عملي', desc: 'أمثلة واقعية يمكنك تطبيقها اليوم' },
    { icon: 'fa-solid fa-handshake', title: 'المجتمع', desc: 'تعلم مع آلاف المصورين' },
    { icon: 'fa-solid fa-arrows-rotate', title: 'دائماً محدث', desc: 'أحدث الاتجاهات وأفضل الممارسات' }
  ];

  constructor() {
    this.dataService.getSiteInfo().subscribe((info) => this.siteInfo.set(info));
    this.dataService.getUniqueAuthors().subscribe((a) => this.authors.set(a));
  }

  get socialEntries(): [string, string][] {
    const info = this.siteInfo();
    if (!info?.social) return [];
    return Object.entries(info.social).filter(([, url]) => !!url);
  }
}
