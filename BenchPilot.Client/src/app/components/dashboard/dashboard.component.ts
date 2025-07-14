import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats: any = {};
  recentActivity: any[] = [];
  topMatches: any[] = [];
  loading = true;

  statsCards = [
    {
      name: 'New Emails',
      value: '0',
      change: '+12%',
      changeType: 'increase',
      icon: 'mail',
      color: 'primary'
    },
    {
      name: 'Active Consultants',
      value: '0',
      change: '+8%',
      changeType: 'increase',
      icon: 'people',
      color: 'accent'
    },
    {
      name: 'Job Requirements',
      value: '0',
      change: '+3',
      changeType: 'increase',
      icon: 'description',
      color: 'warn'
    },
    {
      name: 'Submissions Today',
      value: '0',
      change: '+25%',
      changeType: 'increase',
      icon: 'send',
      color: 'primary'
    }
  ];

  quickActions = [
    { title: 'Check New Emails', icon: 'mail', route: '/emails' },
    { title: 'Upload Resumes', icon: 'upload_file', route: '/consultants' },
    { title: 'Run AI Matching', icon: 'psychology', route: '/matching' },
    { title: 'Review Submissions', icon: 'send', route: '/submissions' }
  ];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;

    // Load stats
    this.dashboardService.getStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.updateStatsCards();
      },
      error: (error) => console.error('Error loading stats:', error)
    });

    // Load recent activity
    this.dashboardService.getRecentActivity().subscribe({
      next: (activity) => {
        this.recentActivity = activity;
      },
      error: (error) => console.error('Error loading activity:', error)
    });

    // Load top matches
    this.dashboardService.getTopMatches().subscribe({
      next: (matches) => {
        this.topMatches = matches;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading matches:', error);
        this.loading = false;
      }
    });
  }

  updateStatsCards(): void {
    this.statsCards[0].value = this.stats.newEmails?.toString() || '0';
    this.statsCards[1].value = this.stats.activeConsultants?.toString() || '0';
    this.statsCards[2].value = this.stats.jobRequirements?.toString() || '0';
    this.statsCards[3].value = this.stats.submissionsToday?.toString() || '0';
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'email': return 'mail';
      case 'match': return 'psychology';
      case 'submission': return 'send';
      default: return 'info';
    }
  }

  getActivityColor(status: string): string {
    switch (status) {
      case 'new': return 'primary';
      case 'success': return 'accent';
      case 'warning': return 'warn';
      default: return '';
    }
  }

  getTimeAgo(timestamp: string): string {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  }

  refreshData(): void {
    this.loadDashboardData();
  }
}