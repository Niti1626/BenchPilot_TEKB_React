import React, { useState } from 'react';
import { 
  Mail, 
  MailOpen, 
  Search, 
  Filter, 
  RefreshCw, 
  Calendar,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Settings,
  Brain,
  Edit3,
  Save,
  X,
  Zap,
  Play,
  Pause,
  Square,
  Check,
  MoreHorizontal,
  Download,
  Archive,
  Trash2,
  RotateCcw,
  Target,
  Loader
} from 'lucide-react';

const EmailInbox: React.FC = () => {
  const [selectedEmail, setSelectedEmail] = useState<number | null>(null);
  const [selectedEmails, setSelectedEmails] = useState<number[]>([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [extractedJobData, setExtractedJobData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [autoProcessing, setAutoProcessing] = useState(true);
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [processingQueue, setProcessingQueue] = useState<number[]>([]);
  const [showBulkModal, setShowBulkModal] = useState(false);

  const emails = [
    {
      id: 1,
      from: 'hiring@techcorp.com',
      fromName: 'Sarah Johnson - TechCorp',
      subject: 'Urgent: Senior React Developer Position - Remote',
      preview: 'We have an immediate need for a Senior React Developer with 5+ years experience...',
      timestamp: '2024-01-15T10:30:00Z',
      isRead: false,
      status: 'new',
      priority: 'High',
      aiConfidence: 95,
      hasAttachment: true,
      category: 'job_requirement'
    },
    {
      id: 2,
      from: 'recruiter@innovate.com',
      fromName: 'Mike Chen - Innovate Solutions',
      subject: 'DevOps Engineer - San Francisco',
      preview: 'Looking for a DevOps Engineer with Docker and Kubernetes experience...',
      timestamp: '2024-01-15T09:15:00Z',
      isRead: false,
      status: 'new',
      priority: 'Medium',
      aiConfidence: 88,
      hasAttachment: false,
      category: 'job_requirement'
    },
    {
      id: 3,
      from: 'vendor@analytics.com',
      fromName: 'Lisa Wang - Analytics Pro',
      subject: 'Data Scientist Role - Contract Position',
      preview: 'We need a Data Scientist with Python and Machine Learning expertise...',
      timestamp: '2024-01-15T08:45:00Z',
      isRead: true,
      status: 'processed',
      priority: 'Low',
      aiConfidence: 92,
      hasAttachment: true,
      category: 'job_requirement'
    },
    {
      id: 4,
      from: 'noreply@spam.com',
      fromName: 'Marketing Team',
      subject: 'Special Offer - Limited Time!',
      preview: 'Get 50% off on our premium services...',
      timestamp: '2024-01-15T07:20:00Z',
      isRead: false,
      status: 'spam',
      priority: 'Low',
      aiConfidence: 15,
      hasAttachment: false,
      category: 'spam'
    },
    {
      id: 5,
      from: 'client@startup.com',
      fromName: 'John Smith - StartupCo',
      subject: 'Full Stack Developer Needed ASAP',
      preview: 'We are looking for a full stack developer to join our team...',
      timestamp: '2024-01-14T16:30:00Z',
      isRead: false,
      status: 'review_needed',
      priority: 'High',
      aiConfidence: 75,
      hasAttachment: false,
      category: 'job_requirement'
    }
  ];

  const processingSteps = [
    'Analyzing Email Content',
    'Extracting Job Details',
    'Parsing Client Information',
    'Validating Extracted Data',
    'Ready for Review'
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'processed': return 'bg-green-100 text-green-800';
      case 'review_needed': return 'bg-yellow-100 text-yellow-800';
      case 'spam': return 'bg-red-100 text-red-800';
      case 'skipped': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'bg-green-100 text-green-800';
    if (confidence >= 80) return 'bg-blue-100 text-blue-800';
    if (confidence >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const filteredEmails = emails.filter(email => {
    if (filterStatus === 'all') return true;
    return email.status === filterStatus;
  });

  const newEmailsCount = emails.filter(email => email.status === 'new').length;
  const autoEligibleCount = emails.filter(email => 
    email.status === 'new' && email.aiConfidence >= 90 && email.category === 'job_requirement'
  ).length;

  const handleEmailSelect = (emailId: number) => {
    setSelectedEmails(prev => 
      prev.includes(emailId) 
        ? prev.filter(id => id !== emailId)
        : [...prev, emailId]
    );
  };

  const handleSelectNew = () => {
    const newEmailIds = emails
      .filter(email => email.status === 'new')
      .map(email => email.id);
    setSelectedEmails(newEmailIds);
  };

  const handleProcessJobRequirement = (emailId: number) => {
    setSelectedEmail(emailId);
    setShowProcessingModal(true);
    setIsProcessing(true);
    setProcessingStep(0);

    // Simulate AI processing steps
    const processSteps = async () => {
      for (let i = 0; i <= 4; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setProcessingStep(i);
      }
      
      // Simulate extracted data
      setExtractedJobData({
        jobTitle: { value: 'Senior React Developer', confidence: 95 },
        skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
        experience: { value: 5, confidence: 90 },
        location: { value: 'Remote', confidence: 100 },
        payRate: { value: '$80-100/hour', confidence: 85 },
        rateType: 'Hourly',
        clientName: { value: 'TechCorp Inc.', confidence: 95 },
        vendorContact: { value: 'Sarah Johnson', confidence: 100 },
        vendorEmail: { value: 'hiring@techcorp.com', confidence: 100 },
        urgency: 'High',
        description: 'We have an immediate need for a Senior React Developer with 5+ years experience in modern React, TypeScript, and Node.js. The role is fully remote and offers competitive compensation.',
        overallConfidence: 92
      });
      
      setIsProcessing(false);
    };

    processSteps();
  };

  const handleBulkProcess = () => {
    if (selectedEmails.length === 0) return;
    setShowBulkModal(true);
    setBulkProcessing(true);
    setProcessingQueue([...selectedEmails]);

    // Simulate bulk processing
    setTimeout(() => {
      setBulkProcessing(false);
      setSelectedEmails([]);
      setShowBulkModal(false);
    }, 3000);
  };

  const handleSaveExtractedData = () => {
    // Update email status to processed
    setShowProcessingModal(false);
    setExtractedJobData(null);
    setSelectedEmail(null);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Email Inbox</h1>
          <div className="flex items-center space-x-3">
            {/* Auto Processing Toggle */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Auto Process:</span>
              <button
                onClick={() => setAutoProcessing(!autoProcessing)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  autoProcessing ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    autoProcessing ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              {autoProcessing && (
                <span className="text-xs text-green-600">
                  {autoEligibleCount} eligible
                </span>
              )}
            </div>
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              <Settings className="h-4 w-4 mr-2" />
              Email Settings
            </button>
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
                placeholder="Search emails..."
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="all">All Emails ({emails.length})</option>
              <option value="new">New ({emails.filter(e => e.status === 'new').length})</option>
              <option value="processed">Processed ({emails.filter(e => e.status === 'processed').length})</option>
              <option value="review_needed">Review Needed ({emails.filter(e => e.status === 'review_needed').length})</option>
              <option value="spam">Spam ({emails.filter(e => e.status === 'spam').length})</option>
            </select>
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedEmails.length > 0 && (
        <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-900">
                {selectedEmails.length} email{selectedEmails.length !== 1 ? 's' : ''} selected
              </span>
              <button
                onClick={handleBulkProcess}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Brain className="h-4 w-4 mr-1" />
                Process Selected
              </button>
              <button className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                <Archive className="h-4 w-4 mr-1" />
                Archive
              </button>
              <button className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </button>
            </div>
            <button
              onClick={() => setSelectedEmails([])}
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
            onClick={handleSelectNew}
            className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Check className="h-4 w-4 mr-1" />
            Select New ({newEmailsCount})
          </button>
          {autoProcessing && (
            <div className="flex items-center text-sm text-green-600">
              <Zap className="h-4 w-4 mr-1" />
              Auto-processing enabled ({autoEligibleCount} eligible)
            </div>
          )}
        </div>
      </div>

      {/* Email List */}
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-gray-200">
          {filteredEmails.map((email) => (
            <div
              key={email.id}
              className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                selectedEmail === email.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
              } ${!email.isRead ? 'bg-blue-25' : ''}`}
              onClick={() => setSelectedEmail(email.id)}
            >
              <div className="flex items-start space-x-3">
                {/* Checkbox */}
                <div className="flex-shrink-0 pt-1">
                  <input
                    type="checkbox"
                    checked={selectedEmails.includes(email.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleEmailSelect(email.id);
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>

                {/* Email Icon */}
                <div className="flex-shrink-0 pt-1">
                  {email.isRead ? (
                    <MailOpen className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Mail className="h-5 w-5 text-blue-600" />
                  )}
                </div>

                {/* Email Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <p className={`text-sm ${!email.isRead ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                        {email.fromName}
                      </p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(email.status)}`}>
                        {email.status.replace('_', ' ')}
                      </span>
                      {email.category === 'job_requirement' && (
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(email.aiConfidence)}`}>
                          AI: {email.aiConfidence}%
                        </span>
                      )}
                      {autoProcessing && email.status === 'new' && email.aiConfidence >= 90 && email.category === 'job_requirement' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Zap className="h-3 w-3 mr-1" />
                          Auto-eligible
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-medium ${getPriorityColor(email.priority)}`}>
                        {email.priority}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(email.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  
                  <p className={`text-sm mb-2 ${!email.isRead ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                    {email.subject}
                  </p>
                  
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {email.preview}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-2">
                      {email.hasAttachment && (
                        <span className="inline-flex items-center text-xs text-gray-500">
                          <Download className="h-3 w-3 mr-1" />
                          Attachment
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {email.category === 'job_requirement' && email.status === 'new' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProcessJobRequirement(email.id);
                          }}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                          <Brain className="h-3 w-3 mr-1" />
                          Process Job Requirement
                        </button>
                      )}
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Processing Modal */}
      {showProcessingModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-6 pt-6 pb-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {isProcessing ? 'AI Job Extraction in Progress' : 'Review Extracted Job Data'}
                  </h3>
                  <button
                    onClick={() => setShowProcessingModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {isProcessing ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-center">
                      <div className="relative">
                        <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Brain className="h-8 w-8 text-blue-600" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {processingSteps.map((step, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                            index < processingStep ? 'bg-green-500' :
                            index === processingStep ? 'bg-blue-500' : 'bg-gray-200'
                          }`}>
                            {index < processingStep ? (
                              <Check className="h-3 w-3 text-white" />
                            ) : index === processingStep ? (
                              <Loader className="h-3 w-3 text-white animate-spin" />
                            ) : (
                              <span className="text-xs text-gray-500">{index + 1}</span>
                            )}
                          </div>
                          <span className={`text-sm ${
                            index <= processingStep ? 'text-gray-900 font-medium' : 'text-gray-500'
                          }`}>
                            {step}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : extractedJobData && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 mb-3">Job Information</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-blue-700 mb-1">Job Title</label>
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={extractedJobData.jobTitle.value}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                              />
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getConfidenceColor(extractedJobData.jobTitle.confidence)}`}>
                                {extractedJobData.jobTitle.confidence}%
                              </span>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-blue-700 mb-1">Required Skills</label>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {extractedJobData.skills.map((skill: string, index: number) => (
                                <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {skill}
                                  <button className="ml-1 text-blue-600 hover:text-blue-800">
                                    <X className="h-3 w-3" />
                                  </button>
                                </span>
                              ))}
                            </div>
                            <input
                              type="text"
                              placeholder="Add skill..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-blue-700 mb-1">Experience (Years)</label>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="number"
                                  value={extractedJobData.experience.value}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                                />
                                <span className={`px-2 py-1 rounded text-xs font-medium ${getConfidenceColor(extractedJobData.experience.confidence)}`}>
                                  {extractedJobData.experience.confidence}%
                                </span>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-blue-700 mb-1">Location</label>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="text"
                                  value={extractedJobData.location.value}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                                />
                                <span className={`px-2 py-1 rounded text-xs font-medium ${getConfidenceColor(extractedJobData.location.confidence)}`}>
                                  {extractedJobData.location.confidence}%
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-blue-700 mb-1">Pay Rate</label>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="text"
                                  value={extractedJobData.payRate.value}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                                />
                                <span className={`px-2 py-1 rounded text-xs font-medium ${getConfidenceColor(extractedJobData.payRate.confidence)}`}>
                                  {extractedJobData.payRate.confidence}%
                                </span>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-blue-700 mb-1">Rate Type</label>
                              <select
                                value={extractedJobData.rateType}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                              >
                                <option>Hourly</option>
                                <option>Daily</option>
                                <option>Annual</option>
                                <option>Contract</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-50 rounded-lg p-4">
                        <h4 className="font-medium text-green-900 mb-3">Client & Contact Information</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-green-700 mb-1">Client Name</label>
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={extractedJobData.clientName.value}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                              />
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getConfidenceColor(extractedJobData.clientName.confidence)}`}>
                                {extractedJobData.clientName.confidence}%
                              </span>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-green-700 mb-1">Vendor Contact</label>
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={extractedJobData.vendorContact.value}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                              />
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getConfidenceColor(extractedJobData.vendorContact.confidence)}`}>
                                {extractedJobData.vendorContact.confidence}%
                              </span>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-green-700 mb-1">Vendor Email</label>
                            <div className="flex items-center space-x-2">
                              <input
                                type="email"
                                value={extractedJobData.vendorEmail.value}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                              />
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getConfidenceColor(extractedJobData.vendorEmail.confidence)}`}>
                                {extractedJobData.vendorEmail.confidence}%
                              </span>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-green-700 mb-1">Urgency Level</label>
                            <select
                              value={extractedJobData.urgency}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            >
                              <option>Low</option>
                              <option>Medium</option>
                              <option>High</option>
                              <option>Urgent</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      <div className="bg-purple-50 rounded-lg p-4">
                        <h4 className="font-medium text-purple-900 mb-3">AI Confidence Score</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-purple-700">Overall Confidence</span>
                            <span className="text-lg font-bold text-purple-900">{extractedJobData.overallConfidence}%</span>
                          </div>
                          <div className="w-full bg-purple-200 rounded-full h-3">
                            <div 
                              className="bg-purple-600 h-3 rounded-full transition-all duration-500"
                              style={{ width: `${extractedJobData.overallConfidence}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-purple-700">
                            High confidence score indicates reliable data extraction
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
                        <textarea
                          rows={12}
                          value={extractedJobData.description}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>

                      <div className="bg-yellow-50 rounded-lg p-4">
                        <h4 className="font-medium text-yellow-900 mb-2">Review Notes</h4>
                        <textarea
                          rows={3}
                          placeholder="Add any notes or corrections..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {!isProcessing && extractedJobData && (
                <div className="bg-gray-50 px-6 py-4 flex justify-between">
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit More
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Re-process
                    </button>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowProcessingModal(false)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveExtractedData}
                      className="inline-flex items-center px-6 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Job Requirement
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bulk Processing Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Bulk Processing Jobs
                    </h3>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">
                        Processing {processingQueue.length} job requirement emails...
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                      </div>
                      {bulkProcessing && (
                        <div className="flex items-center justify-center">
                          <Loader className="h-6 w-6 text-blue-600 animate-spin mr-2" />
                          <span className="text-sm text-gray-600">Processing emails...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailInbox;