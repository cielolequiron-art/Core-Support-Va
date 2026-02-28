import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate, useParams, Outlet, useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { 
  Search, 
  User, 
  Briefcase, 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  CheckCircle, 
  Clock, 
  DollarSign,
  Plus,
  Users,
  BarChart3,
  ShieldCheck,
  MessageSquare,
  ArrowLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Send,
  CreditCard,
  Award,
  Trophy,
  Zap,
  Star,
  FileText,
  Activity,
  AlertTriangle,
  Ban,
  Eye,
  MoreVertical,
  Filter,
  Download,
  Trash2,
  Lock,
  Unlock,
  RefreshCw,
  TrendingUp,
  PieChart,
  Layers,
  Globe,
  Mail,
  Bell
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart,
  Bar,
  Cell,
  PieChart as RePieChart,
  Pie
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { supabase } from './lib/supabase';
import { 
  UserData, 
  UserRole, 
  UserStatus, 
  JobStatus, 
  SubscriptionStatus, 
  Job, 
  Subscription, 
  Payment, 
  Report, 
  AdminLog 
} from './types';

// Admin Components
import { AdminOverview } from './admin/AdminOverview';
import { AdminUsers } from './admin/AdminUsers';
import { AdminJobs } from './admin/AdminJobs';
import { AdminSubscriptions, AdminPayments } from './admin/AdminBilling';
import { AdminReports, AdminSettings, AdminAuditLogs } from './admin/AdminModules';
import { AdminAnalytics } from './admin/AdminAnalytics';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SubscriptionPage = ({ user }: { user: UserData | null }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!user) return <Navigate to="/login" />;

  const currentPlan = user.subscription?.plan || 'Free';

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">Manage Subscription</h1>
        <p className="text-zinc-500">View and manage your current billing plan.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Current Plan</div>
                <div className="text-2xl font-black text-indigo-600 uppercase">{currentPlan}</div>
              </div>
              <div className="bg-emerald-50 text-emerald-600 px-4 py-1 rounded-full text-xs font-bold">
                Active
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Billing Cycle</span>
                <span className="font-bold text-zinc-900">Monthly</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Next Payment</span>
                <span className="font-bold text-zinc-900">{user.subscription?.periodEnd || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Payment Method</span>
                <span className="flex items-center gap-2 font-bold text-zinc-900">
                  <CreditCard className="w-4 h-4" /> **** 4242
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => navigate('/pricing')}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
              >
                Upgrade Plan
              </button>
              <button className="flex-1 bg-white text-red-600 border border-red-100 py-3 rounded-xl font-bold hover:bg-red-50 transition-all">
                Cancel Subscription
              </button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
            <h3 className="text-lg font-bold text-zinc-900 mb-4">Billing History</h3>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-zinc-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-zinc-50 rounded-lg">
                      <FileText className="w-4 h-4 text-zinc-400" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-zinc-900">Invoice #VA-2026-00{i}</div>
                      <div className="text-xs text-zinc-500">Feb {28 - i}, 2026</div>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-zinc-900">$69.00</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-600 p-8 rounded-3xl text-white shadow-xl shadow-indigo-100">
            <Zap className="w-8 h-8 mb-4 text-indigo-200" />
            <h3 className="text-xl font-bold mb-2">Need more power?</h3>
            <p className="text-indigo-100 text-sm leading-relaxed mb-6">
              Upgrade to Premium for AI Matching and unlimited background checks.
            </p>
            <button 
              onClick={() => navigate('/pricing')}
              className="w-full bg-white text-indigo-600 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-all"
            >
              View Premium
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SkillAssessmentPage = ({ user }: { user: UserData | null }) => {
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeAssessment, setActiveAssessment] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    // Mock data for assessments
    const mockAssessments = [
      {
        id: '1',
        title: 'Data Entry Proficiency',
        category: 'Administrative',
        questions: [
          { q: 'What is the most important factor in data entry?', options: ['Speed', 'Accuracy', 'Design', 'Creativity'], a: 'Accuracy' },
          { q: 'Which tool is best for managing large datasets?', options: ['Word', 'Excel', 'PowerPoint', 'Notepad'], a: 'Excel' }
        ]
      },
      {
        id: '2',
        title: 'Social Media Strategy',
        category: 'Marketing',
        questions: [
          { q: 'Which platform is best for B2B networking?', options: ['TikTok', 'Instagram', 'LinkedIn', 'Snapchat'], a: 'LinkedIn' },
          { q: 'What does ROI stand for?', options: ['Rate of Interest', 'Return on Investment', 'Risk of Injury', 'Range of Influence'], a: 'Return on Investment' }
        ]
      }
    ];
    setAssessments(mockAssessments);
    setLoading(false);
  }, []);

  const startAssessment = (assessment: any) => {
    setActiveAssessment(assessment);
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
  };

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestion < activeAssessment.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate result
      let correct = 0;
      newAnswers.forEach((ans, i) => {
        if (ans === activeAssessment.questions[i].a) correct++;
      });
      const score = (correct / activeAssessment.questions.length) * 100;
      setResult({ score, passed: score >= 80 });
    }
  };

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-zinc-900 mb-4">Skill Verification Center</h1>
        <p className="text-zinc-500 max-w-2xl mx-auto">
          Pass assessments to earn verified badges on your profile and stand out to employers.
        </p>
      </div>

      {activeAssessment ? (
        <div className="max-w-2xl mx-auto">
          {result ? (
            <div className="bg-white p-12 rounded-3xl border border-zinc-200 shadow-xl text-center">
              {result.passed ? (
                <>
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Trophy className="w-10 h-10" />
                  </div>
                  <h2 className="text-3xl font-bold text-zinc-900 mb-2">Assessment Passed!</h2>
                  <p className="text-zinc-500 mb-8">Congratulations! You've earned the <span className="font-bold text-zinc-900">{activeAssessment.title}</span> badge.</p>
                  <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl inline-flex items-center gap-3 mb-8">
                    <Award className="w-6 h-6 text-emerald-600" />
                    <span className="text-emerald-700 font-bold uppercase tracking-wider text-xs">Verified Skill Badge Awarded</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <X className="w-10 h-10" />
                  </div>
                  <h2 className="text-3xl font-bold text-zinc-900 mb-2">Assessment Failed</h2>
                  <p className="text-zinc-500 mb-8">You scored {result.score}%. You need 80% to pass. You can retake this test in 24 hours.</p>
                </>
              )}
              <button 
                onClick={() => setActiveAssessment(null)}
                className="w-full bg-zinc-900 text-white py-4 rounded-2xl font-bold hover:bg-zinc-800 transition-all"
              >
                Back to Assessments
              </button>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-xl">
              <div className="flex items-center justify-between mb-8">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  Question {currentQuestion + 1} of {activeAssessment.questions.length}
                </span>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                  {activeAssessment.category}
                </span>
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-8">
                {activeAssessment.questions[currentQuestion].q}
              </h3>
              <div className="space-y-3">
                {activeAssessment.questions[currentQuestion].options.map((opt: string) => (
                  <button 
                    key={opt}
                    onClick={() => handleAnswer(opt)}
                    className="w-full p-4 text-left border border-zinc-200 rounded-2xl hover:border-indigo-600 hover:bg-indigo-50 transition-all font-medium text-zinc-700"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assessments.map(assessment => (
            <div key={assessment.id} className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-2">{assessment.title}</h3>
              <p className="text-sm text-zinc-500 mb-6">{assessment.category} • {assessment.questions.length} Questions</p>
              <button 
                onClick={() => startAssessment(assessment)}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
              >
                Start Test
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Types ---

// --- Components ---

// --- Components ---

const ApplyModal = ({ job, user, onClose }: { job: any, user: UserData | null, onClose: () => void }) => {
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'JOB_SEEKER') {
      alert('Only Virtual Assistants can apply for jobs.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_id: job.id,
          va_id: user.id,
          cover_letter: coverLetter
        })
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(onClose, 2000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={onClose} 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        exit={{ opacity: 0, scale: 0.95, y: 20 }} 
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl relative z-10 overflow-hidden"
      >
        {success ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-900 mb-2">Application Sent!</h3>
            <p className="text-zinc-500">Your application has been submitted successfully.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-zinc-900">Apply for {job.title}</h3>
              <button type="button" onClick={onClose} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-bold text-zinc-700 mb-2">Cover Letter</label>
              <textarea 
                required
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Tell the employer why you're a great fit for this role..."
                className="w-full h-48 p-4 bg-zinc-50 border border-zinc-200 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 text-sm resize-none"
              />
            </div>

            <button 
              disabled={submitting}
              className="w-full bg-teal-600 text-white py-4 rounded-2xl font-bold hover:bg-teal-700 shadow-lg shadow-teal-100 transition-all flex items-center justify-center gap-2"
            >
              {submitting ? 'Submitting...' : (
                <>
                  Submit Application
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

const JobDetailsPage = ({ user }: { user: UserData | null }) => {
  const { id } = useParams();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/jobs/${id}`)
      .then(res => res.json())
      .then(data => {
        setJob(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="h-8 w-64 bg-zinc-100 animate-pulse rounded mb-4" />
      <div className="h-4 w-full bg-zinc-100 animate-pulse rounded mb-2" />
      <div className="h-4 w-full bg-zinc-100 animate-pulse rounded mb-2" />
      <div className="h-4 w-3/4 bg-zinc-100 animate-pulse rounded" />
    </div>
  );

  if (!job) return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <h2 className="text-2xl font-bold text-zinc-900 mb-4">Job not found</h2>
      <button onClick={() => navigate('/jobs')} className="text-teal-600 font-bold hover:underline">Back to jobs</button>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <button 
        onClick={() => navigate('/jobs')}
        className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-teal-600 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to listings
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              {job.logo_url ? (
                <img src={job.logo_url} alt={job.company_name} className="w-16 h-16 rounded-2xl object-cover border border-zinc-100" />
              ) : (
                <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center font-bold text-2xl">
                  {job.company_name?.charAt(0)}
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold text-zinc-900 mb-1">{job.title}</h1>
                <p className="text-zinc-500 font-medium">{job.company_name}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-zinc-100 mb-8">
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Salary</div>
                <div className="text-sm font-bold text-emerald-600">${job.salary_min} - ${job.salary_max}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Job Type</div>
                <div className="text-sm font-bold text-zinc-900">{job.job_type}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Experience</div>
                <div className="text-sm font-bold text-zinc-900">{job.experience_level}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Posted</div>
                <div className="text-sm font-bold text-zinc-900">{new Date(job.created_at).toLocaleDateString()}</div>
              </div>
            </div>

            <div className="prose prose-zinc max-w-none">
              <h3 className="text-xl font-bold text-zinc-900 mb-4">Job Description</h3>
              <div className="text-zinc-600 leading-relaxed whitespace-pre-wrap">
                <Markdown>{job.description}</Markdown>
              </div>
            </div>

            <div className="mt-10 pt-10 border-t border-zinc-100">
              <h3 className="text-xl font-bold text-zinc-900 mb-4">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {(job.skills || []).map((skill: string) => (
                  <span key={skill} className="px-4 py-2 bg-teal-50 text-teal-600 rounded-xl text-sm font-bold border border-teal-100">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
            <h3 className="text-xl font-bold text-zinc-900 mb-4">About the Company</h3>
            <p className="text-zinc-600 leading-relaxed">{job.company_description || "No company description provided."}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-teal-600 p-8 rounded-3xl text-white shadow-xl shadow-teal-100 sticky top-24">
            <h3 className="text-2xl font-bold mb-2">Interested?</h3>
            <p className="text-teal-50 mb-8 text-sm leading-relaxed">Submit your application today and get a chance to work with {job.company_name}.</p>
            <button 
              onClick={() => setShowApplyModal(true)}
              className="w-full bg-white text-teal-600 py-4 rounded-2xl font-bold hover:bg-teal-50 transition-all shadow-lg"
            >
              Apply Now
            </button>
            <p className="mt-4 text-[10px] text-center text-teal-200 uppercase font-bold tracking-widest">Usually responds in 24 hours</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
            <h4 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              Safety Tips
            </h4>
            <ul className="space-y-3 text-xs text-zinc-500 leading-relaxed">
              <li>• Never pay for job applications or training.</li>
              <li>• Be cautious of jobs that seem too good to be true.</li>
              <li>• Report any suspicious activity to our support team.</li>
            </ul>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showApplyModal && (
          <ApplyModal job={job} user={user} onClose={() => setShowApplyModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

const Navbar = ({ user, onLogout }: { user: UserData | null; onLogout: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-zinc-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="https://static.wixstatic.com/media/225ce0_770c0e789f0348bda3ee004f32a8fb0c~mv2.png/v1/crop/x_244,y_190,w_518,h_479/fill/w_108,h_100,fp_0.50_0.50,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Untitled%20design.png" 
                alt="VAHub Logo" 
                className="w-10 h-10 object-contain"
                referrerPolicy="no-referrer"
              />
              <span className="text-xl font-bold text-zinc-900 tracking-tight">Core Support VA</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/jobs" className="text-sm font-medium text-zinc-600 hover:text-teal-600 transition-colors">Find Jobs</Link>
            <Link to="/talents" className="text-sm font-medium text-zinc-600 hover:text-teal-600 transition-colors">Find Talent</Link>
            <Link to="/pricing" className="text-sm font-medium text-zinc-600 hover:text-teal-600 transition-colors">Pricing</Link>
            
            {user ? (
              <div className="flex items-center gap-4 ml-4">
                <span className="text-xs text-zinc-400 font-medium">{user.email}</span>
                <Link 
                  to={user.role === 'ADMIN' ? '/admin' : user.role === 'EMPLOYER' ? '/employer' : '/va'}
                  className="flex items-center gap-2 text-sm font-medium text-zinc-700 bg-zinc-100 px-3 py-1.5 rounded-full hover:bg-zinc-200 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link 
                  to="/subscription"
                  className="text-zinc-500 hover:text-indigo-600 transition-colors"
                  title="Manage Subscription"
                >
                  <CreditCard className="w-5 h-5" />
                </Link>
                {user.role === 'JOB_SEEKER' && (
                  <Link 
                    to="/assessments"
                    className="text-zinc-500 hover:text-amber-600 transition-colors"
                    title="Skill Assessments"
                  >
                    <Award className="w-5 h-5" />
                  </Link>
                )}
                <button 
                  onClick={onLogout}
                  className="text-zinc-500 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-4">
                <Link to="/login" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">Log in</Link>
                <Link to="/register" className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-all shadow-sm">Sign up</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-zinc-600">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white border-b border-zinc-200 px-4 pt-2 pb-6 space-y-1"
          >
            <Link to="/jobs" className="block px-3 py-2 text-base font-medium text-zinc-600">Find Jobs</Link>
            <Link to="/talents" className="block px-3 py-2 text-base font-medium text-zinc-600">Find Talent</Link>
            <Link to="/pricing" className="block px-3 py-2 text-base font-medium text-zinc-600">Pricing</Link>
            {!user ? (
              <div className="pt-4 flex flex-col gap-2">
                <Link to="/login" className="text-center py-2 text-zinc-600 font-medium">Log in</Link>
                <Link to="/register" className="text-center py-2 bg-indigo-600 text-white rounded-lg font-medium">Sign up</Link>
              </div>
            ) : (
              <div className="pt-4 flex flex-col gap-2">
                <Link to="/dashboard" className="text-center py-2 bg-zinc-100 rounded-lg font-medium">Dashboard</Link>
                <button onClick={onLogout} className="text-center py-2 text-red-600 font-medium">Log out</button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const LandingPage = ({ user }: { user: UserData | null }) => {
  return (
    <div className="min-h-screen">
      {/* Welcome Message for Logged In Users */}
      {user && (
        <div className="bg-teal-600 text-white py-3 text-center font-bold">
          Welcome, {user.email}! You are successfully logged in.
        </div>
      )}
      {/* Hero */}
      <section className="relative py-20 overflow-hidden bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-extrabold text-zinc-900 tracking-tight mb-6"
            >
              Hire the Best <span className="text-indigo-600">Virtual Talent</span> from the Philippines
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-zinc-600 mb-10 leading-relaxed"
            >
              The most trusted marketplace for hiring skilled virtual assistants, developers, and designers. Scalable, secure, and professional.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">
                Post a Job
              </Link>
              <Link to="/jobs" className="w-full sm:w-auto px-8 py-4 bg-white text-zinc-900 border border-zinc-200 rounded-xl font-bold text-lg hover:bg-zinc-50 transition-all">
                Find Work
              </Link>
            </motion.div>
          </div>
        </div>
        
        {/* Background Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-3xl opacity-50" />
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white border-y border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Active VAs', value: '50,000+' },
              { label: 'Jobs Posted', value: '12,000+' },
              { label: 'Success Rate', value: '98%' },
              { label: 'Average Saving', value: '70%' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold text-zinc-900 mb-1">{stat.value}</div>
                <div className="text-sm font-medium text-zinc-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-zinc-900 mb-4">Why choose VAHub?</h2>
            <p className="text-zinc-600 max-w-2xl mx-auto">We've built the most robust platform for remote hiring, focusing on trust, quality, and simplicity.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                title: 'Vetted Talent', 
                desc: 'Every VA goes through a verification process to ensure high quality and reliability.',
                icon: ShieldCheck,
                color: 'bg-emerald-100 text-emerald-600'
              },
              { 
                title: 'Smart Matching', 
                desc: 'Our platform helps you find the perfect candidate based on skills and experience.',
                icon: Search,
                color: 'bg-indigo-100 text-indigo-600'
              },
              { 
                title: 'Secure Messaging', 
                desc: 'Communicate safely within our platform with built-in moderation tools.',
                icon: MessageSquare,
                color: 'bg-blue-100 text-blue-600'
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-zinc-200 hover:shadow-xl transition-all group">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", feature.color)}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-3">{feature.title}</h3>
                <p className="text-zinc-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const LoginPage = ({ onLogin }: { onLogin: (user: UserData) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    console.log('Login attempt', { email });

    // Demo Bypass
    if (email === 'demova' && password === 'demova') {
      console.log('Demo login successful');
      const demoUser: UserData = {
        id: 'demo-va-id',
        name: 'Demo VA',
        email: 'demova@demo.com',
        role: 'JOB_SEEKER',
        status: 'ACTIVE',
        subscription_status: 'none',
        email_verified: true,
        created_at: new Date().toISOString()
      };
      onLogin(demoUser);
      navigate('/');
      setLoading(false);
      return;
    }
    
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (data.user) {
        console.log('Login successful', data.user);
        // Map Supabase user to our UserData
        const userData: UserData = {
          id: data.user.id,
          name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User',
          email: data.user.email || '',
          role: (data.user.user_metadata?.role as UserRole) || 'JOB_SEEKER',
          status: 'ACTIVE',
          subscription_status: 'none',
          email_verified: !!data.user.email_confirmed_at,
          created_at: data.user.created_at
        };
        onLogin(userData);
        navigate('/');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-zinc-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-xl w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-zinc-900">Welcome Back</h1>
          <p className="text-zinc-500">Log in to your VAHub account</p>
        </div>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">{error}</div>}
        {message && <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg text-sm mb-4">{message}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Email or Username</label>
            <input 
              type="text" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="demova"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          <button 
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-md disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-200"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-zinc-400 font-bold">Or use demo</span></div>
          </div>

          <button 
            type="button"
            onClick={() => {
              setEmail('demova');
              setPassword('demova');
            }}
            className="w-full bg-zinc-100 text-zinc-900 py-2.5 rounded-lg font-bold hover:bg-zinc-200 transition-all border border-zinc-200"
          >
            Fill Demo Credentials
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-zinc-500">
          Don't have an account? <Link to="/register" className="text-indigo-600 font-bold">Sign up</Link>
        </div>
      </motion.div>
    </div>
  );
};

const RegisterPage = ({ onLogin }: { onLogin: (user: UserData) => void }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('JOB_SEEKER');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    console.log('Register attempt with Supabase', { email, role });
    
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: role
          }
        }
      });

      if (authError) throw authError;

      if (data.user) {
        console.log('Registration successful', data.user);
        if (data.session) {
          const userData: UserData = {
            id: data.user.id,
            name: name,
            email: email,
            role: role,
            status: 'ACTIVE',
            subscription_status: 'none',
            email_verified: !!data.user.email_confirmed_at,
            created_at: data.user.created_at
          };
          onLogin(userData);
          navigate('/');
        } else {
          setMessage('Registration successful! Please check your email to confirm your account before logging in.');
        }
      }
    } catch (err: any) {
      console.error('Register error:', err);
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-zinc-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-xl w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-zinc-900">Create Account</h1>
          <p className="text-zinc-500">Join the VAHub community today</p>
        </div>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">{error}</div>}
        {message && <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg text-sm mb-4">{message}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button 
              type="button"
              onClick={() => setRole('JOB_SEEKER')}
              className={cn(
                "py-3 rounded-xl border-2 font-bold transition-all flex flex-col items-center gap-1",
                role === 'JOB_SEEKER' ? "border-indigo-600 bg-indigo-50 text-indigo-600" : "border-zinc-100 text-zinc-500 hover:border-zinc-200"
              )}
            >
              <User className="w-5 h-5" />
              <span className="text-xs">I'm a VA</span>
            </button>
            <button 
              type="button"
              onClick={() => setRole('EMPLOYER')}
              className={cn(
                "py-3 rounded-xl border-2 font-bold transition-all flex flex-col items-center gap-1",
                role === 'EMPLOYER' ? "border-indigo-600 bg-indigo-50 text-indigo-600" : "border-zinc-100 text-zinc-500 hover:border-zinc-200"
              )}
            >
              <Briefcase className="w-5 h-5" />
              <span className="text-xs">I'm Hiring</span>
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="name@company.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          <button 
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-md disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-zinc-500">
          Already have an account? <Link to="/login" className="text-indigo-600 font-bold">Log in</Link>
        </div>
      </motion.div>
    </div>
  );
};

// --- Dashboards ---

const AdminGuard = ({ user, children }: { user: UserData | null, children: React.ReactNode }) => {
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const AdminLayout = ({ user }: { user: UserData }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: Briefcase, label: 'Employers', path: '/admin/employers' },
    { icon: FileText, label: 'Job Postings', path: '/admin/jobs' },
    { icon: Zap, label: 'Subscriptions', path: '/admin/subscriptions' },
    { icon: DollarSign, label: 'Payments', path: '/admin/payments' },
    { icon: AlertTriangle, label: 'Reports', path: '/admin/reports' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
    { icon: Activity, label: 'Audit Logs', path: '/admin/audit-logs' },
  ];

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="bg-white border-r border-zinc-200 flex flex-col z-30"
      >
        <div className="p-6 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-zinc-900 tracking-tight">AdminPanel</span>
            </div>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto py-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
                  isActive 
                    ? "bg-indigo-50 text-indigo-600 shadow-sm" 
                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-indigo-600" : "text-zinc-400 group-hover:text-zinc-900")} />
                {sidebarOpen && <span className="font-bold text-sm">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-100">
          <button 
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-3 text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="font-bold text-sm">Exit Admin</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-8 z-20">
          <div className="flex items-center gap-4">
            <h2 className="font-bold text-zinc-900">
              {menuItems.find(m => m.path === location.pathname)?.label || 'Admin'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-zinc-400 hover:text-zinc-900 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-zinc-200 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-zinc-900">{user.name}</div>
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Super Admin</div>
              </div>
              <div className="w-10 h-10 bg-zinc-100 rounded-xl border border-zinc-200 flex items-center justify-center font-bold text-zinc-600">
                {user.name.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const EmployerDashboard = ({ user }: { user: UserData }) => {
  const [showPostModal, setShowPostModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        employer_id: user.id,
        title,
        description,
        salary_min: Number(salaryMin),
        salary_max: Number(salaryMax),
        job_type: 'Full-time',
        experience_level: 'Intermediate'
      })
    });
    if (res.ok) {
      setShowPostModal(false);
      alert('Job posted! Awaiting admin approval.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">Employer Dashboard</h1>
        <button 
          onClick={() => setShowPostModal(true)}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100"
        >
          <Plus className="w-5 h-5" />
          Post New Job
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
            <h2 className="text-xl font-bold text-zinc-900 mb-6">Recent Applicants</h2>
            <div className="text-center py-12 text-zinc-500">
              No applicants yet. Post a job to start receiving applications.
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-indigo-600 p-6 rounded-2xl text-white shadow-xl shadow-indigo-100">
            <h3 className="text-lg font-bold mb-2">Current Plan: Starter</h3>
            <p className="text-indigo-100 text-sm mb-6">You have 2 job posts remaining this month.</p>
            <button className="w-full bg-white text-indigo-600 py-2 rounded-lg font-bold hover:bg-indigo-50 transition-all">
              Upgrade Plan
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
            <h3 className="font-bold text-zinc-900 mb-4">Quick Links</h3>
            <div className="space-y-3">
              <button className="w-full text-left text-sm text-zinc-600 hover:text-indigo-600 flex items-center gap-2">
                <User className="w-4 h-4" /> Company Profile
              </button>
              <button className="w-full text-left text-sm text-zinc-600 hover:text-indigo-600 flex items-center gap-2">
                <Settings className="w-4 h-4" /> Billing Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Post Job Modal */}
      <AnimatePresence>
        {showPostModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPostModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-zinc-900">Post a New Job</h2>
                <button onClick={() => setShowPostModal(false)} className="text-zinc-400 hover:text-zinc-600"><X /></button>
              </div>
              <form onSubmit={handlePostJob} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Job Title</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. Executive Virtual Assistant"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Description</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2 border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 h-32"
                    placeholder="Describe the role and responsibilities..."
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Min Salary ($/mo)</label>
                    <input 
                      type="number" 
                      value={salaryMin}
                      onChange={(e) => setSalaryMin(e.target.value)}
                      className="w-full px-4 py-2 border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Max Salary ($/mo)</label>
                    <input 
                      type="number" 
                      value={salaryMax}
                      onChange={(e) => setSalaryMax(e.target.value)}
                      className="w-full px-4 py-2 border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="1500"
                    />
                  </div>
                </div>
                <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                  Publish Job Listing
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const VADashboard = ({ user }: { user: UserData }) => {
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/jobs').then(res => res.json()).then(setJobs);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-zinc-900 mb-8">Welcome, {user.name}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-zinc-900">Recommended Jobs</h2>
            <Link to="/jobs" className="text-sm font-bold text-indigo-600 hover:underline">View all</Link>
          </div>
          
          <div className="space-y-4">
            {jobs.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-zinc-200 text-zinc-500">
                No jobs available right now. Check back later!
              </div>
            ) : (
              jobs.slice(0, 5).map((job) => (
                <div key={job.id} className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                      <p className="text-sm text-zinc-500 font-medium">{job.company_name}</p>
                    </div>
                    {job.is_featured ? (
                      <span className="bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">Featured</span>
                    ) : null}
                  </div>
                  <p className="text-zinc-600 text-sm line-clamp-2 mb-4">{job.description}</p>
                  <div className="flex items-center gap-4 text-sm text-zinc-500">
                    <div className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> ${job.salary_min} - ${job.salary_max}/mo</div>
                    <div className="flex items-center gap-1"><Clock className="w-4 h-4" /> {job.job_type}</div>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <button className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700 transition-all">Apply Now</button>
                    <button className="px-3 py-2 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-all"><Clock className="w-5 h-5 text-zinc-400" /></button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-zinc-400" />
              </div>
              <div>
                <h3 className="font-bold text-zinc-900">{user.name}</h3>
                <p className="text-xs text-zinc-500">Profile Strength: 45%</p>
              </div>
            </div>
            <div className="w-full bg-zinc-100 h-2 rounded-full mb-6">
              <div className="bg-indigo-600 h-2 rounded-full w-[45%]" />
            </div>
            <button className="w-full border border-indigo-600 text-indigo-600 py-2 rounded-lg font-bold hover:bg-indigo-50 transition-all">
              Complete Profile
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
            <h3 className="font-bold text-zinc-900 mb-4">Your Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Applications Sent</span>
                <span className="font-bold text-zinc-900">0</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Profile Views</span>
                <span className="font-bold text-zinc-900">12</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Shortlisted</span>
                <span className="font-bold text-zinc-900">0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');

  const plans = [
    {
      name: 'FREE',
      price: 'FREE',
      subtitle: 'WHY NO FREE TRIAL?',
      color: 'border-emerald-500',
      headerBg: 'bg-emerald-500',
      features: [
        'Hire & Communicate with Workers',
        'Up to 3 Job Posts',
        'Max 15 applications per Job',
        '2 days Job Post approval',
        'View Job Applications',
        'Use Timeproof',
        'Bookmark Workers',
        'Easypay'
      ]
    },
    {
      name: 'PRO',
      price: '$69',
      subtitle: 'Cancel anytime.',
      color: 'border-blue-500',
      headerBg: 'bg-blue-500',
      savings: '64% Savings!',
      features: [
        'Hire & Communicate with Workers',
        'Up to 3 Job Posts',
        'Max 200 applications per Job',
        'Instant Job Post approval',
        'View Job Applications',
        'Use Timeproof',
        'Bookmark Workers',
        'Easypay',
        'Contact 75 workers / month',
        'Read Worker Reviews'
      ],
      footer: 'Cancel Anytime Easily'
    },
    {
      name: 'PREMIUM',
      price: '$99',
      subtitle: 'Cancel anytime.',
      color: 'border-red-500',
      headerBg: 'bg-red-500',
      badge: 'MOST POPULAR!',
      savings: '71% Savings!',
      aiMatching: true,
      features: [
        'Hire & Communicate with Workers',
        'Up to 10 Job Posts',
        'Max 200 applications per Job',
        'Instant Job Post approval',
        'View Job Applications',
        'Use Timeproof',
        'Bookmark Workers',
        'Easypay',
        'Contact 500 workers / month',
        'Read Worker Reviews',
        'Unlimited Background Data Checks',
        'Worker Mentoring Service'
      ],
      footer: 'Cancel Anytime Easily'
    }
  ];

  return (
    <div className="bg-zinc-50 min-h-screen py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-900">Hire direct. No salary markups or ongoing fees.</h1>
          <p className="text-xl text-zinc-600">Cancel when done recruiting.</p>
          <p className="text-lg text-zinc-500 font-medium">Hire great talent or we'll give your money back. It's better than a "free trial."</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {plans.map((plan) => (
            <div key={plan.name} className={cn(
              "bg-white rounded-3xl border-t-8 shadow-xl overflow-hidden relative flex flex-col h-full",
              plan.color
            )}>
              {plan.badge && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white px-6 py-1.5 rounded-full text-sm font-bold shadow-lg z-10 whitespace-nowrap">
                  {plan.badge}
                </div>
              )}
              
              <div className="p-8 text-center border-b border-zinc-100">
                <div className={cn("inline-block px-4 py-1 rounded-lg text-white text-sm font-bold mb-4 uppercase tracking-wider", plan.headerBg)}>
                  {plan.name}
                </div>
                {plan.subtitle && (
                  <div className="mb-4">
                    <button className="text-blue-600 text-xs font-bold underline uppercase tracking-wider hover:text-blue-700">
                      {plan.subtitle}
                    </button>
                  </div>
                )}
                <div className="flex items-center justify-center gap-1 mb-2">
                  <span className="text-6xl font-black text-blue-600 tracking-tighter">{plan.price}</span>
                  {plan.price !== 'FREE' && <span className="text-zinc-400 font-bold text-sm self-end mb-2">USD</span>}
                </div>
                {plan.price !== 'FREE' && (
                  <div className="bg-blue-600 text-white text-[10px] font-bold py-1 px-3 rounded inline-block mb-6">
                    Cancel anytime.
                  </div>
                )}

                {plan.savings && (
                  <div className="flex p-1 bg-zinc-100 rounded-xl mb-6">
                    <button 
                      onClick={() => setBillingCycle('monthly')}
                      className={cn(
                        "flex-1 py-2 text-xs font-bold rounded-lg transition-all",
                        billingCycle === 'monthly' ? "bg-blue-600 text-white shadow-md" : "text-zinc-500"
                      )}
                    >
                      Monthly
                    </button>
                    <button 
                      onClick={() => setBillingCycle('annually')}
                      className={cn(
                        "flex-1 py-2 text-xs font-bold rounded-lg transition-all relative",
                        billingCycle === 'annually' ? "bg-blue-600 text-white shadow-md" : "text-zinc-500"
                      )}
                    >
                      Annually
                      <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full whitespace-nowrap">
                        ({plan.savings})
                      </span>
                    </button>
                  </div>
                )}

                {plan.aiMatching && (
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-6 text-left relative overflow-hidden">
                    <div className="text-blue-800 font-bold text-xs">AI Matching</div>
                    <div className="text-blue-600 text-[10px] font-medium">(Tell me who to hire!)</div>
                    <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">NEW!</div>
                  </div>
                )}
              </div>

              <div className="p-8 flex-1 space-y-4">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 bg-blue-600 rounded p-0.5">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm font-bold text-zinc-700 leading-tight">
                      {feature.includes('workers / month') ? (
                        <>
                          {feature} <span className="text-blue-400 font-black">?</span>
                        </>
                      ) : feature}
                    </span>
                  </div>
                ))}

                {plan.aiMatching && (
                  <div className="flex items-start gap-3 pt-4 border-t border-zinc-50">
                    <div className="mt-0.5 bg-blue-600 rounded p-0.5">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-zinc-700">AI Matching</span>
                        <span className="bg-blue-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">NEW!</span>
                        <span className="text-blue-400 font-black text-xs">?</span>
                      </div>
                      <div className="text-[10px] text-blue-600 font-medium">(Tell me who to hire!)</div>
                    </div>
                  </div>
                )}
              </div>

              {plan.footer && (
                <div className="p-4 bg-zinc-50 border-t border-zinc-100 text-center">
                  <button className="text-blue-600 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 mx-auto hover:underline">
                    <ShieldCheck className="w-3 h-3" />
                    {plan.footer}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TalentSearchPage = () => {
  const [talents, setTalents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [salaryRange, setSalaryRange] = useState([2, 40]);
  const [idProofMin, setIdProofMin] = useState(40);

  useEffect(() => {
    fetch('/api/talents')
      .then(res => res.json())
      .then(data => {
        setTalents(data);
        setLoading(false);
      });
  }, []);

  const filteredTalents = talents.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || 
                         t.headline.toLowerCase().includes(search.toLowerCase()) ||
                         t.bio.toLowerCase().includes(search.toLowerCase());
    const matchesSalary = t.hourly_rate >= salaryRange[0] && t.hourly_rate <= salaryRange[1];
    const matchesIdProof = t.id_proof_score >= idProofMin;
    return matchesSearch && matchesSalary && matchesIdProof;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 mb-6">Better Search Results?</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Active Skill Filters</label>
                <button className="w-full py-2 px-4 border-2 border-dashed border-zinc-200 rounded-xl text-zinc-400 text-sm font-bold hover:border-teal-500 hover:text-teal-600 transition-all flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add skill filters
                </button>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Employment Type</label>
                <select className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500">
                  <option>Any</option>
                  <option>Full-Time</option>
                  <option>Part-Time</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Availability (Hours Per Day)</label>
                <div className="flex items-center gap-2">
                  <input type="number" defaultValue={2} className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-sm outline-none" />
                  <span className="text-zinc-400">-</span>
                  <input type="number" defaultValue={12} className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-sm outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Hourly Salary (USD)</label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">$</span>
                    <input 
                      type="number" 
                      value={salaryRange[0]} 
                      onChange={(e) => setSalaryRange([parseInt(e.target.value) || 0, salaryRange[1]])}
                      className="w-full p-3 pl-6 bg-white border border-zinc-200 rounded-xl text-sm outline-none" 
                    />
                  </div>
                  <span className="text-zinc-400">-</span>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">$</span>
                    <input 
                      type="number" 
                      value={salaryRange[1]} 
                      onChange={(e) => setSalaryRange([salaryRange[0], parseInt(e.target.value) || 0])}
                      className="w-full p-3 pl-6 bg-white border border-zinc-200 rounded-xl text-sm outline-none" 
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">ID Proof Score</label>
                <select 
                  value={idProofMin}
                  onChange={(e) => setIdProofMin(parseInt(e.target.value))}
                  className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value={0}>Any</option>
                  <option value={40}>40+</option>
                  <option value={60}>60+</option>
                  <option value={80}>80+</option>
                </select>
              </div>

              <div className="space-y-4 pt-4 border-t border-zinc-100">
                {['Last Active', 'IQ Score', 'English Score'].map(filter => (
                  <div key={filter}>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">{filter}</label>
                    <select className="w-full p-2 bg-white border border-zinc-200 rounded-lg text-xs outline-none">
                      <option>Any</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-teal-50 p-6 rounded-3xl border border-teal-100">
            <p className="text-sm text-teal-800 font-medium italic mb-4">
              “I'm very thankful for what OFS and Onlinejobs.ph has done for me!”
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-200 rounded-full" />
              <div>
                <div className="text-xs font-bold text-teal-900">Sam Sapp</div>
                <button className="text-[10px] font-bold text-teal-600 uppercase tracking-wider hover:underline">See more real results</button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
              <input 
                type="text"
                placeholder="Search Profile Descriptions"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-zinc-200 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-teal-500 transition-all"
              />
            </div>
            <div className="relative flex-1">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
              <input 
                type="text"
                placeholder="Search Name"
                className="w-full pl-12 pr-4 py-4 bg-white border border-zinc-200 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-teal-500 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-zinc-500 font-medium">
              Found <span className="font-bold text-zinc-900">{filteredTalents.length}</span> jobseekers.
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-zinc-300 text-teal-600 focus:ring-teal-500" />
              <span className="text-sm font-medium text-zinc-600">Include Hired Profiles</span>
            </label>
          </div>

          <div className="space-y-6">
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="bg-white p-8 rounded-3xl border border-zinc-200 animate-pulse h-64" />
              ))
            ) : filteredTalents.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-zinc-200 text-center">
                <Search className="w-12 h-12 text-zinc-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-zinc-900 mb-2">No jobseekers found</h3>
                <p className="text-zinc-500">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              filteredTalents.map((talent) => (
                <motion.div 
                  key={talent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center font-bold text-2xl border border-teal-100">
                        {talent.name.charAt(0)}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-2xl font-bold text-zinc-900 group-hover:text-teal-600 transition-colors">{talent.name}</h3>
                            {talent.verified_skills && talent.verified_skills.length > 0 && (
                              <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full text-[10px] font-bold border border-amber-100">
                                <Award className="w-3 h-3" />
                                Verified
                              </div>
                            )}
                          </div>
                          <p className="text-zinc-500 font-medium">{talent.headline}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="px-4 py-2 text-xs font-bold text-zinc-400 uppercase tracking-wider hover:text-teal-600 transition-colors">PIN</button>
                          <button className="px-4 py-2 bg-teal-50 text-teal-600 rounded-xl text-xs font-bold hover:bg-teal-100 transition-colors">view profile</button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 mb-6">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          {talent.id_proof_score} ID PROOF
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          LOOKING FOR {talent.availability}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                          <DollarSign className="w-3.5 h-3.5" />
                          at ${talent.hourly_rate}/hour (${talent.monthly_salary}/month)
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 py-4 border-y border-zinc-50">
                        <div>
                          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Education</div>
                          <div className="text-xs font-bold text-zinc-700">{talent.education}</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Last Active</div>
                          <div className="text-xs font-bold text-zinc-700">{talent.last_active}</div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Profile Description</div>
                        <p className="text-sm text-zinc-600 leading-relaxed line-clamp-2">{talent.bio}</p>
                      </div>

                      <div>
                        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Top Skills</div>
                        <div className="flex flex-wrap gap-2">
                          {talent.skills?.map((skill: any, idx: number) => (
                            <span key={idx} className="px-3 py-1.5 bg-zinc-50 text-zinc-600 rounded-lg text-xs font-bold border border-zinc-100">
                              {skill.skill_name}: <span className="text-zinc-400">{skill.years_experience}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-12">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(p => (
              <button key={p} className={cn("w-10 h-10 rounded-xl text-sm font-bold transition-all", p === 1 ? "bg-teal-600 text-white shadow-lg shadow-teal-100" : "bg-white text-zinc-500 border border-zinc-200 hover:border-teal-500 hover:text-teal-600")}>
                {p}
              </button>
            ))}
            <button className="w-10 h-10 rounded-xl bg-white text-zinc-500 border border-zinc-200 hover:border-teal-500 hover:text-teal-600 flex items-center justify-center">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const JobsPage = ({ user }: { user: UserData | null }) => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [skillFilter, setSkillFilter] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyingJob, setApplyingJob] = useState<any | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/jobs')
      .then(res => res.json())
      .then(data => {
        setJobs(data);
        setLoading(false);
      });
  }, []);

  const allSkills = Array.from(new Set(jobs.flatMap(j => (j.skills || []) as string[]))).sort() as string[];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase()) || 
                          job.description.toLowerCase().includes(search.toLowerCase()) ||
                          (job.skills || []).some((s: string) => s.toLowerCase().includes(search.toLowerCase()));
    const matchesType = typeFilter.length === 0 || typeFilter.includes(job.job_type);
    const matchesSkills = skillFilter.length === 0 || skillFilter.every(s => (job.skills || []).includes(s));
    return matchesSearch && matchesType && matchesSkills;
  });

  const toggleType = (type: string) => {
    setTypeFilter(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleSkill = (skill: string) => {
    setSkillFilter(prev => {
      if (prev.includes(skill)) return prev.filter(s => s !== skill);
      if (prev.length >= 3) return prev;
      return [...prev, skill];
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full md:w-72 space-y-8">
          <div>
            <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2 uppercase text-xs tracking-widest">
              Filter by skills
            </h3>
            <div className="mb-2 text-[10px] font-bold text-teal-600 uppercase">Select up to 3 skills</div>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search jobs or skills..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
              {allSkills.map(skill => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium transition-all border",
                    skillFilter.includes(skill) 
                      ? "bg-teal-600 border-teal-600 text-white" 
                      : "bg-white border-zinc-200 text-zinc-600 hover:border-teal-300"
                  )}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-zinc-900 mb-4 uppercase text-xs tracking-widest">Employment Type</h3>
            <div className="space-y-3">
              {['Gig', 'Part-Time', 'Full-Time'].map((type) => (
                <label key={type} className="flex items-center gap-3 cursor-pointer group">
                  <div 
                    onClick={() => toggleType(type)}
                    className={cn(
                      "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                      typeFilter.includes(type) ? "bg-teal-600 border-teal-600" : "border-zinc-200 group-hover:border-zinc-300"
                    )}
                  >
                    {typeFilter.includes(type) && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-sm text-zinc-600 group-hover:text-zinc-900">{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="p-6 bg-teal-50 rounded-2xl border border-teal-100">
            <h4 className="font-bold text-teal-900 text-sm mb-2">Need help?</h4>
            <p className="text-xs text-teal-700 leading-relaxed mb-4">Our support team is here to help you find the perfect job.</p>
            <button className="text-xs font-bold text-teal-600 hover:underline">Contact Support</button>
          </div>
        </div>

        {/* Job Listings */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-zinc-900">
              Displaying <span className="text-teal-600">{filteredJobs.length}</span> out of {jobs.length} jobs
            </h2>
          </div>

          <div className="space-y-6">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-40 bg-zinc-100 animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-zinc-200">
                <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-zinc-300" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 mb-2">No jobs found</h3>
                <p className="text-zinc-500">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={job.id} 
                  className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-xl hover:border-teal-100 transition-all group relative overflow-hidden"
                >
                  {job.is_featured ? (
                    <div className="absolute top-0 right-0">
                      <div className="bg-amber-400 text-white text-[10px] font-black uppercase tracking-tighter px-6 py-1 rotate-45 translate-x-4 translate-y-2 shadow-sm">
                        Featured
                      </div>
                    </div>
                  ) : null}
                  
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-zinc-900 group-hover:text-teal-600 transition-colors">{job.title}</h3>
                        <span className="text-xs font-medium text-zinc-400">• Posted on {new Date(job.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center gap-1.5 text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                          <DollarSign className="w-3.5 h-3.5" />
                          {job.salary_min === job.salary_max ? `$${job.salary_min}` : `$${job.salary_min} - $${job.salary_max}`}
                        </div>
                        <div className="flex items-center gap-1.5 text-sm font-medium text-zinc-500">
                          <Briefcase className="w-4 h-4" />
                          {job.company_name}
                        </div>
                        <div className="flex items-center gap-1.5 text-sm font-medium text-zinc-500">
                          <Clock className="w-4 h-4" />
                          {job.job_type}
                        </div>
                      </div>
                      <p className="text-zinc-600 leading-relaxed mb-6 line-clamp-3">{job.description}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        {(job.skills || []).map((skill: string) => (
                          <span key={skill} className="text-[10px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 border border-teal-100 px-2 py-1 rounded-md">
                            {skill}
                          </span>
                        ))}
                        {['Remote', 'Verified'].map(tag => (
                          <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 border border-zinc-100 px-2 py-1 rounded-md">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-3 min-w-[140px]">
                      <button 
                        onClick={() => setApplyingJob(job)}
                        className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700 shadow-lg shadow-teal-100 transition-all"
                      >
                        Apply Now
                      </button>
                      <button 
                        onClick={() => navigate(`/jobs/${job.id}`)}
                        className="w-full bg-white text-zinc-900 border border-zinc-200 py-3 rounded-xl font-bold hover:bg-zinc-50 transition-all"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {applyingJob && (
          <ApplyModal job={applyingJob} user={user} onClose={() => setApplyingJob(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const userData: UserData = {
          id: session.user.id,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
          role: (session.user.user_metadata?.role as UserRole) || 'JOB_SEEKER',
          status: 'ACTIVE',
          subscription_status: 'none',
          email_verified: !!session.user.email_confirmed_at,
          created_at: session.user.created_at
        };
        setUser(userData);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const userData: UserData = {
          id: session.user.id,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
          role: (session.user.user_metadata?.role as UserRole) || 'JOB_SEEKER',
          status: 'ACTIVE',
          subscription_status: 'none',
          email_verified: !!session.user.email_confirmed_at,
          created_at: session.user.created_at
        };
        setUser(userData);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = (userData: UserData) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (loading) return null;

  return (
    <Router>
      <div className="min-h-screen bg-zinc-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
        <Navbar user={user} onLogout={handleLogout} />
        
        <main>
          <Routes>
            <Route path="/" element={<LandingPage user={user} />} />
            <Route path="/jobs" element={<JobsPage user={user} />} />
            <Route path="/jobs/:id" element={<JobDetailsPage user={user} />} />
            <Route path="/talents" element={<TalentSearchPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/subscription" element={<SubscriptionPage user={user} />} />
            <Route path="/assessments" element={<SkillAssessmentPage user={user} />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminGuard user={user}><AdminLayout user={user} /></AdminGuard>}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminOverview />} />
              <Route path="users" element={<AdminUsers admin={user!} />} />
              <Route path="employers" element={<AdminUsers admin={user!} filterRole="EMPLOYER" />} />
              <Route path="jobs" element={<AdminJobs admin={user!} />} />
              <Route path="subscriptions" element={<AdminSubscriptions />} />
              <Route path="payments" element={<AdminPayments />} />
              <Route path="reports" element={<AdminReports admin={user!} />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="audit-logs" element={<AdminAuditLogs />} />
            </Route>

            <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} />} />
            <Route path="/register" element={user ? <Navigate to="/" /> : <RegisterPage onLogin={handleLogin} />} />
            
            {/* Protected Routes */}
            <Route path="/employer" element={user?.role === 'EMPLOYER' ? <EmployerDashboard user={user} /> : <Navigate to="/login" />} />
            <Route path="/va" element={user?.role === 'JOB_SEEKER' ? <VADashboard user={user} /> : <Navigate to="/login" />} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <footer className="bg-white border-t border-zinc-200 py-12 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              <div>
                <h4 className="font-bold text-zinc-900 mb-4">Platform</h4>
                <ul className="space-y-2 text-sm text-zinc-500">
                  <li><Link to="/jobs" className="hover:text-indigo-600">Find Jobs</Link></li>
                  <li><Link to="/talents" className="hover:text-indigo-600">Find Talent</Link></li>
                  <li><Link to="/pricing" className="hover:text-indigo-600">Pricing</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-zinc-900 mb-4">Support</h4>
                <ul className="space-y-2 text-sm text-zinc-500">
                  <li><Link to="/help" className="hover:text-indigo-600">Help Center</Link></li>
                  <li><Link to="/contact" className="hover:text-indigo-600">Contact Us</Link></li>
                  <li><Link to="/safety" className="hover:text-indigo-600">Safety & Trust</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-zinc-900 mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-zinc-500">
                  <li><Link to="/about" className="hover:text-indigo-600">About Us</Link></li>
                  <li><Link to="/blog" className="hover:text-indigo-600">Blog</Link></li>
                  <li><Link to="/careers" className="hover:text-indigo-600">Careers</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-zinc-900 mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-zinc-500">
                  <li><Link to="/terms" className="hover:text-indigo-600">Terms of Service</Link></li>
                  <li><Link to="/privacy" className="hover:text-indigo-600">Privacy Policy</Link></li>
                </ul>
              </div>
            </div>
            <div className="pt-8 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <img 
                  src="https://static.wixstatic.com/media/225ce0_770c0e789f0348bda3ee004f32a8fb0c~mv2.png/v1/crop/x_244,y_190,w_518,h_479/fill/w_108,h_100,fp_0.50_0.50,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Untitled%20design.png" 
                  alt="VAHub Logo" 
                  className="w-6 h-6 object-contain"
                  referrerPolicy="no-referrer"
                />
                <span className="font-bold text-zinc-900">VAHub</span>
              </div>
              <p className="text-sm text-zinc-400">© 2026 VAHub Marketplace. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
