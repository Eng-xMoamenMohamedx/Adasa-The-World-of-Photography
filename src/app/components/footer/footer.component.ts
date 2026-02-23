import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataService, SiteInfo } from '../../services/data.service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  private readonly dataService = inject(DataService);
  readonly siteInfo = signal<SiteInfo | null>(null);

  constructor() {
    this.dataService.getSiteInfo().subscribe((info) => this.siteInfo.set(info));
  }

  readonly currentYear = new Date().getFullYear();

  get socialEntries(): [string, string][] {
    const info = this.siteInfo();
    if (!info?.social) return [];
    return Object.entries(info.social).filter(([, url]) => !!url);
  }
}
