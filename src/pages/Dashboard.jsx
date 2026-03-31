import React, { useEffect, useState } from "react";
import { FaBox, FaBook, FaGraduationCap, FaBriefcase, FaUsers, FaUser, FaPlus, FaEye, FaEyeSlash } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import Container from "../components/Container";
import DashboardTable from "../components/DashboardTable";
import usePortfolioStore from "../store/store";
import showToast from "../utils/toast";

export default function Dashboard() {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false); // Loading state for CRUD operations
  const [activeTab, setActiveTab] = useState('projects');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Store data
  const projects = usePortfolioStore((s) => s.projects || []);
  const blogs = usePortfolioStore((s) => s.blogs || []);
  const educations = usePortfolioStore((s) => s.educations || []);
  const workExperiences = usePortfolioStore((s) => s.workExperiences || []);
  const references = usePortfolioStore((s) => s.references || []);
  const users = usePortfolioStore((s) => s.users || []);
  
  // Fetch functions
  const fetchProjectsRemote = usePortfolioStore((s) => s.fetchProjectsRemote);
  const fetchBlogsRemote = usePortfolioStore((s) => s.fetchBlogsRemote);
  const fetchEducationsRemote = usePortfolioStore((s) => s.fetchEducationsRemote);
  const fetchWorkRemote = usePortfolioStore((s) => s.fetchWorkRemote);
  const fetchReferencesRemote = usePortfolioStore((s) => s.fetchReferencesRemote);
  const fetchRemote = usePortfolioStore((s) => s.fetchRemote);
  
  // CRUD functions
  const createProjectRemote = usePortfolioStore((s) => s.createProjectRemote);
  const updateProjectRemote = usePortfolioStore((s) => s.updateProjectRemote);
  const deleteProjectRemote = usePortfolioStore((s) => s.deleteProjectRemote);
  
  const createBlogRemote = usePortfolioStore((s) => s.createBlogRemote);
  const updateBlogRemote = usePortfolioStore((s) => s.updateBlogRemote);
  const deleteBlogRemote = usePortfolioStore((s) => s.deleteBlogRemote);
  
  const createEducationRemote = usePortfolioStore((s) => s.createEducationRemote);
  const updateEducationRemote = usePortfolioStore((s) => s.updateEducationRemote);
  const deleteEducationRemote = usePortfolioStore((s) => s.deleteEducationRemote);
  
  const createWorkRemote = usePortfolioStore((s) => s.createWorkRemote);
  const updateWorkRemote = usePortfolioStore((s) => s.updateWorkRemote);
  const deleteWorkRemote = usePortfolioStore((s) => s.deleteWorkRemote);
  
  const createReferenceRemote = usePortfolioStore((s) => s.createReferenceRemote);
  const updateReferenceRemote = usePortfolioStore((s) => s.updateReferenceRemote);
  const deleteReferenceRemote = usePortfolioStore((s) => s.deleteReferenceRemote);
  
  const createRemoteWithImage = usePortfolioStore((s) => s.createRemoteWithImage);
  const updateRemoteWithImage = usePortfolioStore((s) => s.updateRemoteWithImage);
  const deleteRemote = usePortfolioStore((s) => s.deleteRemote);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchProjectsRemote(),
        fetchBlogsRemote(),
        fetchEducationsRemote(),
        fetchWorkRemote(),
        fetchReferencesRemote(),
        fetchRemote(),
      ]);
      setLoading(false);
    };
    loadData();
  }, [fetchProjectsRemote, fetchBlogsRemote, fetchEducationsRemote, fetchWorkRemote, fetchReferencesRemote, fetchRemote]);

  const tabs = [
    { id: 'projects', label: 'Projects', data: projects, icon: FaBox },
    { id: 'blogs', label: 'Blogs', data: blogs, icon: FaBook },
    { id: 'educations', label: 'Education', data: educations, icon: FaGraduationCap },
    { id: 'workExperiences', label: 'Work', data: workExperiences, icon: FaBriefcase },
    { id: 'references', label: 'References', data: references, icon: FaUsers },
    { id: 'users', label: 'Users', data: users, icon: FaUser },
  ];

  const getFieldsForTab = (tabId) => {
    const fields = {
      projects: [
        { name: 'name', label: 'Project Name', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'textarea', required: true },
        { name: 'projectsImageUrl', label: 'Image', type: 'file' },
      ],
      blogs: [
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'date', label: 'Date', type: 'date', required: true },
        { name: 'summary', label: 'Summary', type: 'textarea', required: true },
        { name: 'blogImageUrl', label: 'Image', type: 'file' },
      ],
      educations: [
        { name: 'school', label: 'School', type: 'text', required: true },
        { name: 'degree', label: 'Degree', type: 'text', required: true },
        { name: 'field', label: 'Field of Study', type: 'text', required: true },
        { name: 'startYear', label: 'Start Year', type: 'text', required: true },
        { name: 'endYear', label: 'End Year', type: 'text' },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'educationImageUrl', label: 'Image', type: 'file' },
      ],
      workExperiences: [
        { name: 'company', label: 'Company', type: 'text', required: true },
        { name: 'position', label: 'Position', type: 'text', required: true },
        { name: 'startDate', label: 'Start Date', type: 'date', required: true },
        { name: 'endDate', label: 'End Date', type: 'date' },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'workImageUrl', label: 'Image', type: 'file' },
      ],
      references: [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'relationship', label: 'Relationship', type: 'text', required: true },
        { name: 'company', label: 'Company', type: 'text' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'phone', label: 'Phone', type: 'tel' },
        { name: 'contact', label: 'Contact Info', type: 'textarea' },
        { name: 'referenceImageUrl', label: 'Image', type: 'file' },
      ],
      users: [
        { name: 'username', label: 'Username', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'password', label: 'Password', type: 'password', required: modalMode === 'create' },
        { name: 'role', label: 'Role', type: 'select', options: ['user', 'admin'], required: true },
        { name: 'bio', label: 'Bio', type: 'textarea' },
        { name: 'profileImageUrl', label: 'Profile Image', type: 'file' },
      ],
    };
    return fields[tabId] || [];
  };

  const openModal = (mode, item = null) => {
    setModalMode(mode);
    if (mode === 'edit' && item) {
      setFormData(item);
      // Set image preview if exists
      const imageField = Object.keys(item).find(key => key.includes('ImageUrl') || key === 'profileImageUrl');
      if (imageField && item[imageField]) {
        setImagePreview(item[imageField]);
      }
    } else {
      setFormData({});
      setImagePreview('');
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({});
    setImageFile(null);
    setImagePreview('');
    setShowPassword(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (submitting) return; // Prevent multiple submissions
    
    setSubmitting(true);
    
    try {
      const payload = { ...formData };
      
      // Handle image upload if file selected
      if (imageFile) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const dataUrl = reader.result;
          payload.imageDataUrl = dataUrl; // Changed from imageData to imageDataUrl
          payload.imageFilename = imageFile.name;
          await submitData(payload);
        };
        reader.readAsDataURL(imageFile);
      } else {
        await submitData(payload);
      }
    } catch (error) {
      console.error('Submit error:', error);
      showToast.error(error.message || 'Failed to save');
      setSubmitting(false);
    }
  };

  const submitData = async (payload) => {
    try {
      let result;
      
      if (modalMode === 'create') {
        // Generate ID for new items
        payload.id = Date.now().toString();
        
        switch (activeTab) {
          case 'projects': result = await createProjectRemote(payload); break;
          case 'blogs': result = await createBlogRemote(payload); break;
          case 'educations': result = await createEducationRemote(payload); break;
          case 'workExperiences': result = await createWorkRemote(payload); break;
          case 'references': result = await createReferenceRemote(payload); break;
          case 'users': 
            if (imageFile) {
              result = await createRemoteWithImage(payload, imageFile);
            } else {
              result = await createRemoteWithImage(payload, null);
            }
            break;
          default:
            throw new Error('Unknown tab');
        }
      } else {
        switch (activeTab) {
          case 'projects': result = await updateProjectRemote(payload); break;
          case 'blogs': result = await updateBlogRemote(payload); break;
          case 'educations': result = await updateEducationRemote(payload); break;
          case 'workExperiences': result = await updateWorkRemote(payload); break;
          case 'references': result = await updateReferenceRemote(payload); break;
          case 'users':
            if (imageFile) {
              result = await updateRemoteWithImage(payload, imageFile);
            } else {
              result = await updateRemoteWithImage(payload, null);
            }
            break;
          default:
            throw new Error('Unknown tab');
        }
      }
      
      if (result?.success) {
        closeModal();
        showToast.success(`${modalMode === 'create' ? 'Created' : 'Updated'} successfully!`);
      } else {
        showToast.error(result?.error?.message || 'Failed to save');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (item) => {
    console.log('handleDelete called with item:', item);
    console.log('item.id:', item.id);
    console.log('activeTab:', activeTab);
    
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    if (submitting) return; // Prevent multiple deletions
    
    setSubmitting(true);
    
    try {
      let result;
      switch (activeTab) {
        case 'projects': result = await deleteProjectRemote(item.id); break;
        case 'blogs': result = await deleteBlogRemote(item.id); break;
        case 'educations': result = await deleteEducationRemote(item.id); break;
        case 'workExperiences': result = await deleteWorkRemote(item.id); break;
        case 'references': result = await deleteReferenceRemote(item.id); break;
        case 'users': 
          console.log('Calling deleteRemote with id:', item.id);
          result = await deleteRemote(item.id); 
          console.log('deleteRemote result:', result);
          break;
        default:
          throw new Error('Unknown tab');
      }
      
      if (result?.success) {
        showToast.success('Deleted successfully!');
      } else {
        showToast.error(result?.error?.message || 'Failed to delete');
      }
    } catch (error) {
      console.error('Delete error:', error);
      showToast.error(error.message || 'Failed to delete');
    } finally {
      setSubmitting(false);
    }
  };

  const getCurrentData = () => {
    const tab = tabs.find(t => t.id === activeTab);
    return tab ? tab.data : [];
  };

  if (loading) {
    return (
      <Container>
        <div className={`${colors.background.secondary} rounded-lg p-12 text-center`}>
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mb-4"></div>
          <p className={colors.text.secondary}>Loading dashboard...</p>
        </div>
      </Container>
    );
  }

  const currentData = getCurrentData();
  const currentFields = getFieldsForTab(activeTab);

  return (
    <Container>
      <div className="py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-2xl lg:text-3xl font-bold  ${colors.text.primary}`}>Admin Dashboard</h1>
          <p className={`${colors.text.secondary} text-sm md:text-base`}>Manage all portfolio content from one place.</p>
        </div>

        {/* Tabs */}
        <div className={`mb-5 rounded-lg border ${colors.border} overflow-x-auto`}>
          <div className={`flex`}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => !submitting && setActiveTab(tab.id)}
                disabled={submitting}
                className={`flex items-center gap-1 md:gap-1.5 lg:gap-2 px-5 md:px-5 lg:px-6 pt-5 pb-2 md:py-3.5 lg:py-4 whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? `border-sky-600 ${colors.text.primary} ${colors.background.primary}`
                    : `border-transparent ${colors.text.secondary} hover:${colors.background.secondary}`
                } ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="relative">
                  <span className="text-lg lg:text-xl"><tab.icon /></span>
                  <span className={`absolute -top-3 -right-3 px-1.5 py-0.5 text-[10px]  rounded-full ${colors.background.tertiary}`}>
                    {tab.data.length}
                  </span>
                </div>
                <span className="hidden md:inline font-medium text-xs md:text-sm">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* tag body */}


        {/* Action Bar */}
        <div className="flex justify-between items-center mb-2">
          <h2 className={`text-2xl font-semibold ${colors.text.primary}`}>
            {tabs.find(t => t.id === activeTab)?.label || 'Items'}
          </h2>
          <button
            onClick={() => openModal('create')}
            disabled={submitting}
            className={`${colors.button.primary} px-2  lg:px-4 py-2  rounded-lg transition flex items-center gap-2 ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <FaPlus className="w-5 h-5" />
            <span className="hidden lg:inline">Add New</span>
          </button>
        </div>

        {/* Data Table */}
        <DashboardTable
          data={currentData}
          fields={currentFields}
          onEdit={(item) => openModal('edit', item)}
          onDelete={handleDelete}
          loading={loading}
          submitting={submitting}
        />
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`${colors.background.primary} rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
              <div className={`sticky top-0 ${colors.background.secondary} border-b ${colors.border} p-6`}>
                <h3 className={`text-2xl font-bold ${colors.text.primary}`}>
                  {modalMode === 'create' ? 'Create New' : 'Edit'} {tabs.find(t => t.id === activeTab)?.label.slice(0, -1)}
                </h3>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-4">
                  {currentFields.map((field) => (
                    <div key={field.name}>
                      <label className={`block text-sm font-medium ${colors.text.primary} mb-2`}>
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                      </label>
                      {field.type === 'textarea' ? (
                        <textarea
                          name={field.name}
                          value={formData[field.name] || ''}
                          onChange={handleInputChange}
                          required={field.required}
                          rows={4}
                          className={`w-full px-4 py-2 rounded-lg border ${colors.border} ${colors.background.secondary} ${colors.text.primary} focus:ring-2 focus:ring-sky-500 focus:border-transparent`}
                        />
                      ) : field.type === 'select' ? (
                        <select
                          name={field.name}
                          value={formData[field.name] || ''}
                          onChange={handleInputChange}
                          required={field.required}
                          className={`w-full px-4 py-2 rounded-lg border ${colors.border} ${colors.background.secondary} ${colors.text.primary} focus:ring-2 focus:ring-sky-500 focus:border-transparent`}
                        >
                          <option value="">Select {field.label}</option>
                          {field.options?.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : field.type === 'file' ? (
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className={`w-full px-4 py-2 rounded-lg border ${colors.border} ${colors.background.secondary} ${colors.text.primary} focus:ring-2 focus:ring-sky-500 focus:border-transparent`}
                          />
                          {imagePreview && (
                            <img src={imagePreview} alt="Preview" className="mt-2 h-32 w-32 object-cover rounded-lg" />
                          )}
                        </div>
                      ) : field.type === 'password' ? (
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            name={field.name}
                            value={formData[field.name] || ''}
                            onChange={handleInputChange}
                            required={field.required}
                            className={`w-full px-4 py-2 pr-12 rounded-lg border ${colors.border} ${colors.background.secondary} ${colors.text.primary} focus:ring-2 focus:ring-sky-500 focus:border-transparent`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className={`absolute right-3 top-1/2 -translate-y-1/2 ${colors.text.secondary} hover:${colors.text.primary} transition`}
                          >
                            {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                          </button>
                        </div>
                      ) : (
                        <input
                          type={field.type}
                          name={field.name}
                          value={formData[field.name] || ''}
                          onChange={handleInputChange}
                          required={field.required}
                          className={`w-full px-4 py-2 rounded-lg border ${colors.border} ${colors.background.secondary} ${colors.text.primary} focus:ring-2 focus:ring-sky-500 focus:border-transparent`}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`flex-1 ${colors.button.primary} px-6 py-3 rounded-lg transition ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {modalMode === 'create' ? 'Creating...' : 'Updating...'}
                      </span>
                    ) : (
                      modalMode === 'create' ? 'Create' : 'Update'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={submitting}
                    className={`flex-1 ${colors.button.secondary} px-6 py-3 rounded-lg transition ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

    </Container>
  );
}