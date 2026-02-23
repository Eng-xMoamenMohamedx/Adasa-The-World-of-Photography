import { Component, inject } from '@angular/core';
import { NetworkStatusService } from '../../services/network-status.service';

@Component({
  selector: 'app-offline-banner',
  standalone: true,
  template: `
    @if (!networkStatus.isOnline()) {
      <div class="offline-banner">
        <i class="fa-solid fa-wifi-slash"></i>
        <span>لا يوجد اتصال بالإنترنت. يتم عرض المحتوى المخزن.</span>
      </div>
    }
  `,
  styles: [`
    .offline-banner {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 99998;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 12px 24px;
      background: linear-gradient(135deg, #dc2626, #b91c1c);
      color: #fff;
      font-weight: 600;
      font-size: 14px;
    }
    .offline-banner i {
      font-size: 18px;
    }
  `]
})
export class OfflineBannerComponent {
  readonly networkStatus = inject(NetworkStatusService);
}
