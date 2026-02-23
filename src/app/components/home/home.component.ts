import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArticlesComponent } from "./components/articles/articles.component";
import { CategoriesComponent } from "./components/categories/categories.component";
import { NewsletterComponent } from "../newsletter/newsletter.component";
import { DataService, SiteStats } from "../../services/data.service";
import { LatestComponent } from "./components/latest/latest.component";

@Component({
  selector: 'app-home',
  imports: [ArticlesComponent, CategoriesComponent, NewsletterComponent, RouterLink, LatestComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private readonly dataService = inject(DataService);
  readonly stats = signal<SiteStats | null>(null);

  constructor() {
    this.dataService.getStats().subscribe((s) => this.stats.set(s));
  }
}
