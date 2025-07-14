import React, { useState } from 'react';
import { 
  Target, 
  Search, 
  Filter, 
  RefreshCw, 
  Users, 
  FileText, 
  Star,
  MapPin,
  DollarSign,
  Calendar,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Eye,
  Send,
  X,
  Upload,
  Mail
} from 'lucide-react';

const AIMatching: React.FC = () => {
  const [selectedJob, setSelectedJob] = useState<number | null>(1);
  const [matchThreshold, setMatchThreshold] = useState(60);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);

  const jobs = [
    {
      id: 1,
      title: 'Senior React Developer',
      client: 'TechCorp Inc.',
      location: 'Remote',
      rate: '$80-100/hour',
      urgency: 'High',
      requiredSkills: ['React', 'TypeScript', 'Node.js', 'AWS'],
      experience: 5,
      postedDate: '2024-01-15',
      matchCount: 8
    },
    {
      id: 2,
      title: 'DevOps Engineer',
      client: 'Innovate Solutions',
      location: 'San Francisco, CA',
      rate: '$90-120/hour',
      urgency: 'Medium',
      requiredSkills: ['Docker', 'Kubernetes', 'CI/CD', 'Python'],
      experience: 4,
      postedDate: '2024-01-14',
      matchCount: 5
    },
    {
      id: 3,
      title: 'Data Scientist',
      client: 'Analytics Pro',
      location: 'New York, NY',
      rate: '$95-130/hour',
      urgency: 'Low',
      requiredSkills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL'],
      experience: 6,
      postedDate: '2024-01-13',
      matchCount: 3
    }
  ];

  const matches = [
    {
      id: 1,
      jobId: 1,
      consultant: {
        name: 'Alex Rodriguez',
        email: 'alex.rodriguez@email.com',
        location: 'New York, NY',
        rate: 85,
        experience: 8,
        skills: ['React', 'TypeScript', 'Node.js', 'AWS', 'GraphQL'],
        availability: 'Available'
      },
      matchScore: 95,
      skillsMatch: 90,
      experienceMatch: 100,
      locationMatch: 85,
      rateMatch: 95,
      explanation: 'Excellent match with all required skills and senior experience level. Rate is within budget.',
      keyStrengths: ['Perfect skill alignment', 'Senior experience', 'Rate compatibility'],
      concerns: ['Location preference might need discussion']
    },
    {
      id: 2,
      jobId: 1,
      consultant: {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        location: 'Remote',
        rate: 75,
        experience: 6,
        skills: ['React', 'JavaScript', 'Node.js', 'MongoDB'],
        availability: 'Available'
      },
      matchScore: 82,
      skillsMatch: 75,
      experienceMatch: 80,
      locationMatch: 100,
      rateMatch: 90,
      explanation: 'Good match with core React skills. Missing TypeScript and AWS experience.',
      keyStrengths: ['Remote availability', 'Competitive rate', 'React expertise'],
      concerns: ['Missing TypeScript', 'No AWS experience']
    },
    {
      id: 3,
      jobId: 1,
      consultant: {
        name: 'Michael Chen',
        email: 'michael.chen@email.com',
        location: 'San Francisco, CA',
        rate: 95,
        experience: 4,
        skills: ['React', 'TypeScript', 'Python', 'Docker'],
        availability: 'On Project'
      },
      matchScore: 78,
      skillsMatch: 80,
      experienceMatch: 70,
      locationMatch: 75,
      rateMatch: 85,
      explanation: 'Solid technical skills but slightly junior and currently on another project.',
      keyStrengths: ['Strong React/TypeScript skills', 'Modern tech stack'],
      concerns: ['Currently on project', 'Slightly junior level']
    }
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMatchColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'On Project': return 'bg-yellow-100 text-yellow-800';
      case 'Busy': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const selectedJobMatches = matches.filter(match => match.jobId === selectedJob && match.matchScore >= matchThreshold);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">AI Matching Engine</h1>
          <div className="flex items-center space-x-3">
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Matches
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              <Target className="h-4 w-4 mr-2" />
              Run AI Analysis
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search jobs or consultants..."
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Min Match:</label>
              <input
                type="range"
                min="50"
                max="100"
                value={matchThreshold}
                onChange={(e) => setMatchThreshold(Number(e.target.value))}
                className="w-20"
              />
              <span className="text-sm font-medium text-gray-900 w-8">{matchThreshold}%</span>
            </div>
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex">
          {/* Jobs Panel */}
          <div className="w-full lg:w-1/3 border-r border-gray-200 overflow-y-auto">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">Active Job Requirements</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job.id)}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedJob === job.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{job.title}</h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(job.urgency)}`}>
                      {job.urgency}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{job.client}</p>
                  
                  <div className="space-y-1 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-3 w-3 mr-1" />
                      {job.rate}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {job.experience}+ years exp.
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {job.requiredSkills.slice(0, 3).map((skill) => (
                        <span key={skill} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {skill}
                        </span>
                      ))}
                      {job.requiredSkills.length > 3 && (
                        <span className="text-xs text-gray-500">+{job.requiredSkills.length - 3}</span>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-blue-600">
                      <Target className="h-3 w-3 mr-1" />
                      {job.matchCount} matches
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Matches Panel */}
          <div className="flex-1 overflow-y-auto">
            {selectedJob ? (
              <div>
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                      AI Matches ({selectedJobMatches.length})
                    </h2>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Showing matches ≥ {matchThreshold}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {selectedJobMatches.map((match) => (
                    <div key={match.id} className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-medium text-gray-900">{match.consultant.name}</h3>
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getMatchColor(match.matchScore)}`}>
                                <Target className="h-3 w-3 mr-1" />
                                {match.matchScore}% Match
                              </span>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(match.consultant.availability)}`}>
                                {match.consultant.availability}
                              </span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="h-4 w-4 mr-2" />
                              {match.consultant.location}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <DollarSign className="h-4 w-4 mr-2" />
                              ${match.consultant.rate}/hour
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="h-4 w-4 mr-2" />
                              {match.consultant.experience} years exp.
                            </div>
                          </div>

                          <div className="mb-4">
                            <div className="flex flex-wrap gap-1">
                              {match.consultant.skills.map((skill) => (
                                <span key={skill} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="text-center">
                              <div className="text-sm font-medium text-gray-900">{match.skillsMatch}%</div>
                              <div className="text-xs text-gray-500">Skills</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm font-medium text-gray-900">{match.experienceMatch}%</div>
                              <div className="text-xs text-gray-500">Experience</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm font-medium text-gray-900">{match.locationMatch}%</div>
                              <div className="text-xs text-gray-500">Location</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm font-medium text-gray-900">{match.rateMatch}%</div>
                              <div className="text-xs text-gray-500">Rate</div>
                            </div>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <h4 className="font-medium text-gray-900 mb-2">AI Analysis</h4>
                            <p className="text-sm text-gray-700 mb-3">{match.explanation}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h5 className="text-sm font-medium text-green-800 mb-1">Key Strengths</h5>
                                <ul className="text-sm text-green-700 space-y-1">
                                  {match.keyStrengths.map((strength, index) => (
                                    <li key={index} className="flex items-center">
                                      <CheckCircle className="h-3 w-3 mr-1 flex-shrink-0" />
                                      {strength}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h5 className="text-sm font-medium text-yellow-800 mb-1">Considerations</h5>
                                <ul className="text-sm text-yellow-700 space-y-1">
                                  {match.concerns.map((concern, index) => (
                                    <li key={index} className="flex items-center">
                                      <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0" />
                                      {concern}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>

                          <div className="flex space-x-3">
                            <button 
                              onClick={() => {
                                setSelectedMatch(match);
                                setShowSubmissionModal(true);
                              }}
                              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                            >
                              <Send className="h-4 w-4 mr-2" />
                              Create Submission
                            </button>
                            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center">
                              <Eye className="h-4 w-4 mr-2" />
                              View/Edit Profile
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Select a job to view AI matches</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Submission Modal */}
      {showSubmissionModal && selectedMatch && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowSubmissionModal(false)} />
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-6 pt-6 pb-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Create Submission
                  </h3>
                  <button
                    onClick={() => setShowSubmissionModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column - Job & Consultant Info */}
                  <div className="space-y-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-3">Job Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-blue-700">Position:</span>
                          <span className="font-medium text-blue-900">Senior React Developer</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Client:</span>
                          <span className="font-medium text-blue-900">TechCorp Inc.</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Rate:</span>
                          <span className="font-medium text-blue-900">$80-100/hour</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Location:</span>
                          <span className="font-medium text-blue-900">Remote</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-medium text-green-900 mb-3">Consultant Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-green-700">Name:</span>
                          <span className="font-medium text-green-900">{selectedMatch.consultant.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Email:</span>
                          <span className="font-medium text-green-900">{selectedMatch.consultant.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Rate:</span>
                          <span className="font-medium text-green-900">${selectedMatch.consultant.rate}/hour</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Match Score:</span>
                          <span className="font-medium text-green-900">{selectedMatch.matchScore}%</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Resume Attachment
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          Current resume will be attached
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {selectedMatch.consultant.name}_Resume.pdf
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Email Composition */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        To Email *
                      </label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="vendor@client.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CC Email
                      </label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="manager@client.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject Line *
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        defaultValue={`Submission: ${selectedMatch.consultant.name} - Senior React Developer`}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Body *
                      </label>
                      <textarea
                        rows={12}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        defaultValue={`Dear Hiring Manager,

I hope this email finds you well. I am pleased to submit ${selectedMatch.consultant.name} for your Senior React Developer position.

Key Highlights:
• ${selectedMatch.consultant.experience} years of experience in software development
• Strong expertise in: ${selectedMatch.consultant.skills.join(', ')}
• Available for immediate start
• Rate: $${selectedMatch.consultant.rate}/hour
• AI Match Score: ${selectedMatch.matchScore}%

${selectedMatch.consultant.name} is an excellent fit for this role with proven experience in React development and a strong technical background. I believe they would be a valuable addition to your team.

Please find the resume attached for your review. I would be happy to schedule a call to discuss this candidate further.

Best regards,
[Your Name]
[Your Contact Information]`}
                        required
                      />
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="highPriority"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="highPriority" className="ml-2 text-sm text-gray-700">
                          High Priority
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="scheduleSend"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="scheduleSend" className="ml-2 text-sm text-gray-700">
                          Schedule Send
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 flex justify-between">
                <div className="flex space-x-3">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Save as Draft
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Preview
                  </button>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowSubmissionModal(false)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center px-6 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Submission
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIMatching;