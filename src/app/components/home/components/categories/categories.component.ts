import { Component, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService, Category } from '../../../../services/data.service';

@Component({
  selector: 'app-categories',
  imports: [RouterLink],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent {
  private readonly dataService = inject(DataService);
  readonly categories = signal<Category[]>([]);

  constructor() {
    this.dataService.getCategories().subscribe((cats: Category[]) => this.categories.set(cats));
  }

  getCategoryIcon(categoryName: string): string {
    const iconMap: Record<string, string> = {
      'إضاءة': 'fa-solid fa-sun',
      'بورتريه': 'fa-solid fa-user',
      'مناظر طبيعية': 'fa-solid fa-mountain-sun',
      'تقنيات': 'fa-solid fa-sliders',
      'معدات': 'fa-solid fa-camera'
    };
    return iconMap[categoryName] || 'fa-solid fa-folder';
  }
}
