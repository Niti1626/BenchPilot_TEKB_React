import React from 'react';
import { 
  Mail, 
  Users, 
  FileText, 
  Send, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle,
  Target
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    {
      name: 'New Emails',
      value: '24',
      change: '+12%',
      changeType: 'increase',
      icon: Mail,
      color: 'bg-blue-500'
    },
    {
      name: 'Active Consultants',
      value: '156',
      change: '+8%',
      changeType: 'increase',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      name: 'Job Requirements',
      value: '18',
      change: '+3',
      changeType: 'increase',
      icon: FileText,
      color: 'bg-purple-500'
    },
    {
      name: 'Submissions Today',
      value: '12',
      change: '+25%',
      changeType: 'increase',
      icon: Send,
      color: 'bg-orange-500'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'email',
      message: 'New job requirement received from TechCorp',
      time: '2 minutes ago',
      status: 'new'
    },
    {
      id: 2,
      type: 'match',
      message: 'AI found 5 potential matches for Senior React Developer',
      time: '15 minutes ago',
      status: 'success'
    },
    {
      id: 3,
      type: 'submission',
      message: 'Resume submitted for John Smith to Microsoft',
      time: '1 hour ago',
      status: 'pending'
    },
    {
      id: 4,
      type: 'alert',
      message: 'Sarah Johnson hasn\'t been submitted for 3 days',
      time: '2 hours ago',
      status: 'warning'
    }
  ];

  const topMatches = [
    {
      consultant: 'Alex Rodriguez',
      job: 'Senior Full Stack Developer',
      match: 95,
      skills: ['React', 'Node.js', 'AWS'],
      rate: '$85/hr'
    },
    {
      consultant: 'Maria Chen',
      job: 'DevOps Engineer',
      match: 92,
      skills: ['Docker', 'Kubernetes', 'CI/CD'],
      rate: '$90/hr'
    },
    {
      consultant: 'David Kim',
      job: 'Data Scientist',
      match: 88,
      skills: ['Python', 'ML', 'TensorFlow'],
      rate: '$95/hr'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                <span className="text-sm text-gray-500 ml-1">from last week</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'new' ? 'bg-blue-500' :
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'warning' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 flex items-center mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top AI Matches */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Top AI Matches</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topMatches.map((match, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{match.consultant}</h3>
                    <div className="flex items-center">
                      <Target className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm font-medium text-green-600">{match.match}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{match.job}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {match.skills.map((skill) => (
                        <span key={skill} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{match.rate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <div className="text-center">
              <Mail className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-900">Check New Emails</span>
            </div>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <div className="text-center">
              <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-900">Upload Resumes</span>
            </div>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <div className="text-center">
              <Target className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-900">Run AI Matching</span>
            </div>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <div className="text-center">
              <Send className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-900">Review Submissions</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;