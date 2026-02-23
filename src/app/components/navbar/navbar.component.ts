import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, NgClass],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private readonly searchService = inject(SearchService);
  isOpen = true;

  onChangeIcon(): void {
    this.isOpen = !this.isOpen;
  }

  openSearch(): void {
    this.searchService.open();
  }
}
