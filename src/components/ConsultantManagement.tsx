import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Upload, 
  Edit, 
  Eye, 
  MapPin, 
  DollarSign,
  Calendar,
  Star,
  Download,
  Trash2
} from 'lucide-react';

const ConsultantManagement: React.FC = () => {
  const [selectedConsultant, setSelectedConsultant] = useState<number | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const consultants = [
    {
      id: 1,
      name: 'Alex Rodriguez',
      email: 'alex.rodriguez@email.com',
      phone: '+1 (555) 123-4567',
      skills: ['React', 'Node.js', 'AWS', 'TypeScript', 'GraphQL'],
      experience: 8,
      location: 'New York, NY',
      rate: 85,
      rateType: 'Hourly',
      availability: 'Available',
      lastSubmitted: '2024-01-10',
      rating: 4.8,
      totalSubmissions: 23
    },
    {
      id: 2,
      name: 'Maria Chen',
      email: 'maria.chen@email.com',
      phone: '+1 (555) 234-5678',
      skills: ['Docker', 'Kubernetes', 'CI/CD', 'Python', 'Terraform'],
      experience: 6,
      location: 'San Francisco, CA',
      rate: 90,
      rateType: 'Hourly',
      availability: 'On Project',
      lastSubmitted: '2024-01-08',
      rating: 4.9,
      totalSubmissions: 18
    },
    {
      id: 3,
      name: 'David Kim',
      email: 'david.kim@email.com',
      phone: '+1 (555) 345-6789',
      skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL', 'R'],
      experience: 5,
      location: 'Austin, TX',
      rate: 95,
      rateType: 'Hourly',
      availability: 'Available',
      lastSubmitted: '2024-01-12',
      rating: 4.7,
      totalSubmissions: 15
    }
  ];

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'On Project': return 'bg-yellow-100 text-yellow-800';
      case 'Busy': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Consultant Management</h1>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Resumes
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Consultant
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
                placeholder="Search consultants..."
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <select className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
              <option>All Skills</option>
              <option>React</option>
              <option>Node.js</option>
              <option>Python</option>
              <option>AWS</option>
            </select>
            <select className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
              <option>All Availability</option>
              <option>Available</option>
              <option>On Project</option>
              <option>Busy</option>
            </select>
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Consultant List */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex">
          {/* List Panel */}
          <div className="w-full lg:w-2/3 overflow-y-auto">
            <div className="divide-y divide-gray-200">
              {consultants.map((consultant) => (
                <div
                  key={consultant.id}
                  onClick={() => setSelectedConsultant(consultant.id)}
                  className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedConsultant === consultant.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{consultant.name}</h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(consultant.availability)}`}>
                          {consultant.availability}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          {consultant.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <DollarSign className="h-4 w-4 mr-2" />
                          ${consultant.rate}/{consultant.rateType.toLowerCase()}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          {consultant.experience} years exp.
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Star className="h-4 w-4 mr-2 text-yellow-400" />
                          {consultant.rating} ({consultant.totalSubmissions} submissions)
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="flex flex-wrap gap-1">
                          {consultant.skills.slice(0, 5).map((skill) => (
                            <span key={skill} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {skill}
                            </span>
                          ))}
                          {consultant.skills.length > 5 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              +{consultant.skills.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                          Last submitted: {new Date(consultant.lastSubmitted).toLocaleDateString()}
                        </p>
                        <div className="flex items-center space-x-2">
                          <button className="p-1 text-gray-400 hover:text-blue-600">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-green-600">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detail Panel */}
          <div className="hidden lg:block lg:w-1/3 bg-white border-l border-gray-200">
            {selectedConsultant ? (
              <div className="h-full flex flex-col">
                {(() => {
                  const consultant = consultants.find(c => c.id === selectedConsultant);
                  if (!consultant) return null;
                  
                  return (
                    <>
                      <div className="border-b border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-xl font-semibold text-gray-900">{consultant.name}</h2>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getAvailabilityColor(consultant.availability)}`}>
                            {consultant.availability}
                          </span>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p>{consultant.email}</p>
                          <p>{consultant.phone}</p>
                        </div>
                      </div>
                      
                      <div className="flex-1 p-6 overflow-y-auto space-y-6">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 mb-2">Skills</h3>
                          <div className="flex flex-wrap gap-1">
                            {consultant.skills.map((skill) => (
                              <span key={skill} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 mb-1">Experience</h3>
                            <p className="text-sm text-gray-600">{consultant.experience} years</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 mb-1">Rate</h3>
                            <p className="text-sm text-gray-600">${consultant.rate}/{consultant.rateType.toLowerCase()}</p>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-900 mb-1">Location</h3>
                          <p className="text-sm text-gray-600">{consultant.location}</p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-900 mb-2">Performance</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Rating</span>
                              <span className="font-medium">{consultant.rating}/5.0</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Total Submissions</span>
                              <span className="font-medium">{consultant.totalSubmissions}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Last Submitted</span>
                              <span className="font-medium">{new Date(consultant.lastSubmitted).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 p-6">
                        <div className="flex space-x-3">
                          <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                            Edit Profile
                          </button>
                          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                            Download Resume
                          </button>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Select a consultant to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowUploadModal(false)} />
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Upload Resume Files
                    </h3>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm text-gray-600 mb-2">
                        Drag and drop resume files here, or click to select
                      </p>
                      <p className="text-xs text-gray-500">
                        Supports PDF and DOCX files up to 10MB each
                      </p>
                      <input type="file" multiple accept=".pdf,.docx" className="hidden" />
                      <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                        Select Files
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Upload & Process
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
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

export default ConsultantManagement;