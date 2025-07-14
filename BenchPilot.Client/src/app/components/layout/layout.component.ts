import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  sidebarOpen = false;
  currentPage = 'dashboard';

  navigation = [
    { name: 'Dashboard', id: 'dashboard', icon: 'dashboard', route: '/dashboard' },
    { name: 'Email Inbox', id: 'emails', icon: 'mail', route: '/emails' },
    { name: 'Consultants', id: 'consultants', icon: 'people', route: '/consultants' },
    { name: 'Job Requirements', id: 'jobs', icon: 'description', route: '/jobs' },
    { name: 'AI Matching', id: 'matching', icon: 'psychology', route: '/matching' },
    { name: 'Submissions', id: 'submissions', icon: 'send', route: '/submissions' },
    { name: 'Notifications', id: 'notifications', icon: 'notifications', route: '/notifications' },
    { name: 'Settings', id: 'settings', icon: 'settings', route: '/settings' },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Set current page based on route
    this.router.events.subscribe(() => {
      const url = this.router.url;
      const navItem = this.navigation.find(item => item.route === url);
      if (navItem) {
        this.currentPage = navItem.id;
      }
    });
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  navigateTo(route: string, id: string): void {
    this.currentPage = id;
    this.router.navigate([route]);
    this.sidebarOpen = false;
  }
}