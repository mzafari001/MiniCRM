import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  readonly navItems = [
    { label: 'داشبورد', path: '/dashboard', icon: 'dashboard' },
    { label: 'مشتریان', path: '/customers', icon: 'users' },
  ];
}
