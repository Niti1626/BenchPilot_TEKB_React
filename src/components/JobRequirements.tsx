import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Eye, 
  MapPin, 
  DollarSign,
  Calendar,
  Users,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Pause,
  MoreHorizontal,
  Download,
  Archive,
  Trash2,
  Copy,
  Send,
  BarChart3,
  Building,
  Mail,
  Phone,
  Star,
  TrendingUp,
  Activity,
  X,
  Save,
  RefreshCw,
  Zap,
  Brain
} from 'lucide-react';

const JobRequirements: React.FC = () => {
  const [selectedJob, setSelectedJob] = useState<number | null>(null);
  const [selectedJobs, setSelectedJobs] = useState<number[]>([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterClient, setFilterClient] = useState('all');
  const [showJobModal, setShowJobModal] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('view');
  const [showBulkModal, setShowBulkModal] = useState(false);

  const jobRequirements = [
    {
      id: 1,
      title: 'Senior React Developer',
      client: 'TechCorp Inc.',
      clientContact: 'Sarah Johnson',
      clientEmail: 'hiring@techcorp.com',
      clientPhone: '+1 (555) 123-4567',
      status: 'active',
      priority: 'High',
      location: 'Remote',
      jobType: 'Contract',
      duration: '6 months',
      rate: '$80-100/hour',
      rateType: 'Hourly',
      experience: 5,
      skills: ['React', 'TypeScript', 'Node.js', 'AWS', 'GraphQL'],
      description: 'We are looking for a Senior React Developer with extensive experience in modern React development, TypeScript, and cloud technologies. The ideal candidate will have 5+ years of experience and be able to work independently on complex projects.',
      requirements: [
        '5+ years of React development experience',
        'Strong TypeScript skills',
        'Experience with Node.js and Express',
        'AWS cloud platform knowledge',
        'GraphQL API development'
      ],
      niceToHave: [
        'Next.js experience',
        'Docker containerization',
        'CI/CD pipeline setup'
      ],
      createdDate: '2024-01-15',
      updatedDate: '2024-01-15',
      source: 'email_extraction',
      aiConfidence: 95,
      submissionsCount: 8,
      matchesCount: 12,
      viewsCount: 45,
      recruiterAssigned: 'John Doe',
      urgency: 'High',
      clientRating: 4.8,
      budget: 50000,
      startDate: '2024-02-01'
    },
    {
      id: 2,
      title: 'DevOps Engineer',
      client: 'Innovate Solutions',
      clientContact: 'Mike Chen',
      clientEmail: 'mike@innovate.com',
      clientPhone: '+1 (555) 234-5678',
      status: 'active',
      priority: 'Medium',
      location: 'San Francisco, CA',
      jobType: 'Full-time',
      duration: 'Permanent',
      rate: '$120,000-150,000',
      rateType: 'Annual',
      experience: 4,
      skills: ['Docker', 'Kubernetes', 'CI/CD', 'Python', 'Terraform'],
      description: 'Looking for a DevOps Engineer to join our growing team. You will be responsible for maintaining our cloud infrastructure, implementing CI/CD pipelines, and ensuring system reliability.',
      requirements: [
        '4+ years of DevOps experience',
        'Strong Docker and Kubernetes skills',
        'CI/CD pipeline implementation',
        'Python scripting abilities',
        'Infrastructure as Code (Terraform)'
      ],
      niceToHave: [
        'AWS certification',
        'Monitoring tools experience',
        'Security best practices'
      ],
      createdDate: '2024-01-14',
      updatedDate: '2024-01-14',
      source: 'email_extraction',
      aiConfidence: 88,
      submissionsCount: 5,
      matchesCount: 8,
      viewsCount: 32,
      recruiterAssigned: 'Jane Smith',
      urgency: 'Medium',
      clientRating: 4.6,
      budget: 135000,
      startDate: '2024-02-15'
    },
    {
      id: 3,
      title: 'Data Scientist',
      client: 'Analytics Pro',
      clientContact: 'Lisa Wang',
      clientEmail: 'lisa@analytics.com',
      clientPhone: '+1 (555) 345-6789',
      status: 'on_hold',
      priority: 'Low',
      location: 'New York, NY',
      jobType: 'Contract',
      duration: '12 months',
      rate: '$95-130/hour',
      rateType: 'Hourly',
      experience: 6,
      skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL', 'R'],
      description: 'We need a Data Scientist with expertise in machine learning and statistical analysis. The role involves building predictive models and analyzing large datasets.',
      requirements: [
        '6+ years of data science experience',
        'Strong Python and R skills',
        'Machine Learning expertise',
        'TensorFlow/PyTorch experience',
        'SQL and database knowledge'
      ],
      niceToHave: [
        'PhD in related field',
        'Big data technologies',
        'Cloud ML platforms'
      ],
      createdDate: '2024-01-13',
      updatedDate: '2024-01-13',
      source: 'email_extraction',
      aiConfidence: 92,
      submissionsCount: 3,
      matchesCount: 6,
      viewsCount: 28,
      recruiterAssigned: 'Bob Wilson',
      urgency: 'Low',
      clientRating: 4.9,
      budget: 156000,
      startDate: '2024-03-01'
    },
    {
      id: 4,
      title: 'Full Stack Developer',
      client: 'StartupCo',
      clientContact: 'John Smith',
      clientEmail: 'john@startup.com',
      clientPhone: '+1 (555) 456-7890',
      status: 'filled',
      priority: 'High',
      location: 'Austin, TX',
      jobType: 'Full-time',
      duration: 'Permanent',
      rate: '$90,000-120,000',
      rateType: 'Annual',
      experience: 3,
      skills: ['React', 'Node.js', 'MongoDB', 'Express', 'JavaScript'],
      description: 'Seeking a Full Stack Developer to join our startup team. You will work on both frontend and backend development using modern JavaScript technologies.',
      requirements: [
        '3+ years of full stack development',
        'React and Node.js experience',
        'MongoDB database skills',
        'RESTful API development',
        'Agile development experience'
      ],
      niceToHave: [
        'Startup experience',
        'Mobile development',
        'DevOps knowledge'
      ],
      createdDate: '2024-01-10',
      updatedDate: '2024-01-12',
      source: 'manual_entry',
      aiConfidence: null,
      submissionsCount: 12,
      matchesCount: 15,
      viewsCount: 67,
      recruiterAssigned: 'Alice Brown',
      urgency: 'High',
      clientRating: 4.2,
      budget: 105000,
      startDate: '2024-01-20'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'on_hold': return 'bg-yellow-100 text-yellow-800';
      case 'filled': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'on_hold': return Pause;
      case 'filled': return Star;
      case 'cancelled': return XCircle;
      case 'draft': return Edit;
      default: return Clock;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getConfidenceColor = (confidence: number | null) => {
    if (confidence === null) return 'bg-gray-100 text-gray-800';
    if (confidence >= 90) return 'bg-green-100 text-green-800';
    if (confidence >= 80) return 'bg-blue-100 text-blue-800';
    if (confidence >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const filteredJobs = jobRequirements.filter(job => {
    if (filterStatus !== 'all' && job.status !== filterStatus) return false;
    if (filterClient !== 'all' && job.client !== filterClient) return false;
    return true;
  });

  const uniqueClients = [...new Set(jobRequirements.map(job => job.client))];

  const handleJobSelect = (jobId: number) => {
    setSelectedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const handleSelectAll = () => {
    if (selectedJobs.length === filteredJobs.length) {
      setSelectedJobs([]);
    } else {
      setSelectedJobs(filteredJobs.map(job => job.id));
    }
  };

  const handleViewJob = (jobId: number) => {
    setSelectedJob(jobId);
    setModalMode('view');
    setShowJobModal(true);
  };

  const handleEditJob = (jobId: number) => {
    setSelectedJob(jobId);
    setModalMode('edit');
    setShowJobModal(true);
  };

  const handleCreateJob = () => {
    setSelectedJob(null);
    setModalMode('create');
    setShowJobModal(true);
  };

  const selectedJobData = selectedJob ? jobRequirements.find(job => job.id === selectedJob) : null;

  const stats = {
    total: jobRequirements.length,
    active: jobRequirements.filter(job => job.status === 'active').length,
    filled: jobRequirements.filter(job => job.status === 'filled').length,
    onHold: jobRequirements.filter(job => job.status === 'on_hold').length,
    totalSubmissions: jobRequirements.reduce((sum, job) => sum + job.submissionsCount, 0),
    avgConfidence: Math.round(jobRequirements.filter(job => job.aiConfidence).reduce((sum, job) => sum + (job.aiConfidence || 0), 0) / jobRequirements.filter(job => job.aiConfidence).length)
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Job Requirements</h1>
          <div className="flex items-center space-x-3">
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
            <button 
              onClick={handleCreateJob}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Job
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-blue-900">Total Jobs</p>
                <p className="text-xl font-bold text-blue-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-green-900">Active</p>
                <p className="text-xl font-bold text-green-900">{stats.active}</p>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-purple-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-purple-900">Filled</p>
                <p className="text-xl font-bold text-purple-900">{stats.filled}</p>
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center">
              <Pause className="h-5 w-5 text-yellow-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-yellow-900">On Hold</p>
                <p className="text-xl font-bold text-yellow-900">{stats.onHold}</p>
              </div>
            </div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center">
              <Send className="h-5 w-5 text-orange-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-orange-900">Submissions</p>
                <p className="text-xl font-bold text-orange-900">{stats.totalSubmissions}</p>
              </div>
            </div>
          </div>
          <div className="bg-indigo-50 rounded-lg p-4">
            <div className="flex items-center">
              <Brain className="h-5 w-5 text-indigo-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-indigo-900">Avg AI Score</p>
                <p className="text-xl font-bold text-indigo-900">{stats.avgConfidence}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search job requirements..."
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="all">All Status ({jobRequirements.length})</option>
              <option value="active">Active ({stats.active})</option>
              <option value="filled">Filled ({stats.filled})</option>
              <option value="on_hold">On Hold ({stats.onHold})</option>
              <option value="cancelled">Cancelled</option>
              <option value="draft">Draft</option>
            </select>
            <select 
              value={filterClient}
              onChange={(e) => setFilterClient(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="all">All Clients</option>
              {uniqueClients.map(client => (
                <option key={client} value={client}>{client}</option>
              ))}
            </select>
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedJobs.length > 0 && (
        <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-900">
                {selectedJobs.length} job{selectedJobs.length !== 1 ? 's' : ''} selected
              </span>
              <button
                onClick={() => setShowBulkModal(true)}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Edit className="h-4 w-4 mr-1" />
                Bulk Edit
              </button>
              <button className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                <Archive className="h-4 w-4 mr-1" />
                Archive
              </button>
              <button className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                <Download className="h-4 w-4 mr-1" />
                Export
              </button>
            </div>
            <button
              onClick={() => setSelectedJobs([])}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear selection
            </button>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleSelectAll}
            className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            {selectedJobs.length === filteredJobs.length ? 'Deselect All' : 'Select All'}
          </button>
          <div className="flex items-center text-sm text-gray-600">
            <Activity className="h-4 w-4 mr-1" />
            Showing {filteredJobs.length} of {jobRequirements.length} jobs
          </div>
        </div>
      </div>

      {/* Job Requirements List */}
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-gray-200">
          {filteredJobs.map((job) => {
            const StatusIcon = getStatusIcon(job.status);
            return (
              <div
                key={job.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  {/* Checkbox */}
                  <div className="flex-shrink-0 pt-1">
                    <input
                      type="checkbox"
                      checked={selectedJobs.includes(job.id)}
                      onChange={() => handleJobSelect(job.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>

                  {/* Job Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {job.status.replace('_', ' ')}
                          </span>
                          <span className={`text-xs font-medium ${getPriorityColor(job.priority)}`}>
                            {job.priority} Priority
                          </span>
                          {job.aiConfidence && (
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(job.aiConfidence)}`}>
                              <Brain className="h-3 w-3 mr-1" />
                              AI: {job.aiConfidence}%
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-1" />
                            {job.client}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {job.location}
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {job.rate}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {job.experience}+ years
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {job.duration}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {job.skills.slice(0, 6).map((skill) => (
                            <span key={skill} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {skill}
                            </span>
                          ))}
                          {job.skills.length > 6 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              +{job.skills.length - 6} more
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {job.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Target className="h-4 w-4 mr-1" />
                              {job.matchesCount} matches
                            </div>
                            <div className="flex items-center">
                              <Send className="h-4 w-4 mr-1" />
                              {job.submissionsCount} submissions
                            </div>
                            <div className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              {job.viewsCount} views
                            </div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {job.recruiterAssigned}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleViewJob(job.id)}
                              className="p-1 text-gray-400 hover:text-blue-600"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleEditJob(job.id)}
                              className="p-1 text-gray-400 hover:text-green-600"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-gray-600">
                              <Copy className="h-4 w-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-gray-600">
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Job Details Modal */}
      {showJobModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowJobModal(false)} />
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
              <div className="bg-white px-6 pt-6 pb-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {modalMode === 'create' ? 'Create New Job Requirement' : 
                     modalMode === 'edit' ? 'Edit Job Requirement' : 'Job Requirement Details'}
                  </h3>
                  <button
                    onClick={() => setShowJobModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {selectedJobData && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Job Details */}
                    <div className="lg:col-span-2 space-y-6">
                      <div className="bg-blue-50 rounded-lg p-6">
                        <h4 className="font-medium text-blue-900 mb-4">Job Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-blue-700 mb-1">Job Title</label>
                            <input
                              type="text"
                              value={selectedJobData.title}
                              disabled={modalMode === 'view'}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-blue-700 mb-1">Job Type</label>
                            <select
                              value={selectedJobData.jobType}
                              disabled={modalMode === 'view'}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            >
                              <option>Contract</option>
                              <option>Full-time</option>
                              <option>Part-time</option>
                              <option>Temporary</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-blue-700 mb-1">Location</label>
                            <input
                              type="text"
                              value={selectedJobData.location}
                              disabled={modalMode === 'view'}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-blue-700 mb-1">Duration</label>
                            <input
                              type="text"
                              value={selectedJobData.duration}
                              disabled={modalMode === 'view'}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-blue-700 mb-1">Rate</label>
                            <input
                              type="text"
                              value={selectedJobData.rate}
                              disabled={modalMode === 'view'}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-blue-700 mb-1">Experience Required</label>
                            <input
                              type="number"
                              value={selectedJobData.experience}
                              disabled={modalMode === 'view'}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                          </div>
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium text-blue-700 mb-2">Required Skills</label>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {selectedJobData.skills.map((skill, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {skill}
                                {modalMode !== 'view' && (
                                  <button className="ml-1 text-blue-600 hover:text-blue-800">
                                    <X className="h-3 w-3" />
                                  </button>
                                )}
                              </span>
                            ))}
                          </div>
                          {modalMode !== 'view' && (
                            <input
                              type="text"
                              placeholder="Add skill..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                          )}
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium text-blue-700 mb-2">Job Description</label>
                          <textarea
                            rows={4}
                            value={selectedJobData.description}
                            disabled={modalMode === 'view'}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          />
                        </div>
                      </div>

                      <div className="bg-green-50 rounded-lg p-6">
                        <h4 className="font-medium text-green-900 mb-4">Client Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-green-700 mb-1">Client Name</label>
                            <input
                              type="text"
                              value={selectedJobData.client}
                              disabled={modalMode === 'view'}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-green-700 mb-1">Contact Person</label>
                            <input
                              type="text"
                              value={selectedJobData.clientContact}
                              disabled={modalMode === 'view'}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-green-700 mb-1">Email</label>
                            <input
                              type="email"
                              value={selectedJobData.clientEmail}
                              disabled={modalMode === 'view'}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-green-700 mb-1">Phone</label>
                            <input
                              type="tel"
                              value={selectedJobData.clientPhone}
                              disabled={modalMode === 'view'}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Status & Analytics */}
                    <div className="space-y-6">
                      <div className="bg-purple-50 rounded-lg p-6">
                        <h4 className="font-medium text-purple-900 mb-4">Job Status</h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-purple-700 mb-1">Status</label>
                            <select
                              value={selectedJobData.status}
                              disabled={modalMode === 'view'}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            >
                              <option value="active">Active</option>
                              <option value="on_hold">On Hold</option>
                              <option value="filled">Filled</option>
                              <option value="cancelled">Cancelled</option>
                              <option value="draft">Draft</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-purple-700 mb-1">Priority</label>
                            <select
                              value={selectedJobData.priority}
                              disabled={modalMode === 'view'}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            >
                              <option value="Low">Low</option>
                              <option value="Medium">Medium</option>
                              <option value="High">High</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-purple-700 mb-1">Assigned Recruiter</label>
                            <input
                              type="text"
                              value={selectedJobData.recruiterAssigned}
                              disabled={modalMode === 'view'}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="bg-orange-50 rounded-lg p-6">
                        <h4 className="font-medium text-orange-900 mb-4">Performance Metrics</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-orange-700">Total Views</span>
                            <span className="font-medium text-orange-900">{selectedJobData.viewsCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-orange-700">AI Matches</span>
                            <span className="font-medium text-orange-900">{selectedJobData.matchesCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-orange-700">Submissions</span>
                            <span className="font-medium text-orange-900">{selectedJobData.submissionsCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-orange-700">Client Rating</span>
                            <span className="font-medium text-orange-900">{selectedJobData.clientRating}/5.0</span>
                          </div>
                          {selectedJobData.aiConfidence && (
                            <div className="flex justify-between">
                              <span className="text-sm text-orange-700">AI Confidence</span>
                              <span className="font-medium text-orange-900">{selectedJobData.aiConfidence}%</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-6">
                        <h4 className="font-medium text-gray-900 mb-4">Timeline</h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Created</span>
                            <span className="font-medium">{new Date(selectedJobData.createdDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Last Updated</span>
                            <span className="font-medium">{new Date(selectedJobData.updatedDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Start Date</span>
                            <span className="font-medium">{new Date(selectedJobData.startDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Source</span>
                            <span className="font-medium">{selectedJobData.source.replace('_', ' ')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 px-6 py-4 flex justify-between">
                <div className="flex space-x-3">
                  {modalMode === 'view' && (
                    <>
                      <button
                        onClick={() => setModalMode('edit')}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Job
                      </button>
                      <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        <Target className="h-4 w-4 mr-2" />
                        Run AI Matching
                      </button>
                      <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate Job
                      </button>
                    </>
                  )}
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowJobModal(false)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  {modalMode !== 'view' && (
                    <button className="inline-flex items-center px-6 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                      <Save className="h-4 w-4 mr-2" />
                      {modalMode === 'create' ? 'Create Job' : 'Save Changes'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Edit Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowBulkModal(false)} />
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Bulk Edit Jobs ({selectedJobs.length} selected)
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Change Status</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                          <option value="">Select new status...</option>
                          <option value="active">Active</option>
                          <option value="on_hold">On Hold</option>
                          <option value="filled">Filled</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Assign Recruiter</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                          <option value="">Select recruiter...</option>
                          <option value="John Doe">John Doe</option>
                          <option value="Jane Smith">Jane Smith</option>
                          <option value="Bob Wilson">Bob Wilson</option>
                          <option value="Alice Brown">Alice Brown</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Change Priority</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                          <option value="">Select priority...</option>
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Apply Changes
                </button>
                <button
                  type="button"
                  onClick={() => setShowBulkModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobRequirements;