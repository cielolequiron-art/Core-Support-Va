import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate, useParams } from 'react-router-dom';
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
  Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
type UserRole = 'admin' | 'employer' | 'va';
interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: string;
}

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
    if (user.role !== 'va') {
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

const PricingPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-zinc-900 mb-4">Simple, Transparent Pricing</h1>
        <p className="text-zinc-600 max-w-2xl mx-auto">Choose the plan that's right for your business. Upgrade or downgrade at any time.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm hover:shadow-xl transition-all">
          <h3 className="text-xl font-bold text-zinc-900 mb-2">Free</h3>
          <div className="text-4xl font-bold text-zinc-900 mb-6">$0<span className="text-lg text-zinc-400 font-normal">/mo</span></div>
          <ul className="space-y-4 mb-8 text-zinc-600">
            <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-500" /> 1 Job Post</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-500" /> 5 Messages to Applicants</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-500" /> Basic Support</li>
          </ul>
          <button className="w-full py-3 rounded-xl border border-zinc-200 font-bold text-zinc-900 hover:bg-zinc-50 transition-all">Get Started</button>
        </div>

        <div className="bg-teal-600 p-8 rounded-3xl text-white shadow-xl shadow-teal-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-white/20 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-bl-xl">Popular</div>
          <h3 className="text-xl font-bold mb-2">Premium</h3>
          <div className="text-4xl font-bold mb-6">$29<span className="text-lg text-teal-200 font-normal">/mo</span></div>
          <ul className="space-y-4 mb-8 text-teal-50">
            <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-teal-200" /> Unlimited Job Posts</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-teal-200" /> Unlimited Messages to Applicants</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-teal-200" /> Direct Messaging to Applicants</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-teal-200" /> Priority Support</li>
          </ul>
          <button className="w-full py-3 rounded-xl bg-white text-teal-600 font-bold hover:bg-teal-50 transition-all shadow-lg">Upgrade Now</button>
        </div>
      </div>
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
                <Link 
                  to={user.role === 'admin' ? '/admin' : user.role === 'employer' ? '/employer' : '/va'}
                  className="flex items-center gap-2 text-sm font-medium text-zinc-700 bg-zinc-100 px-3 py-1.5 rounded-full hover:bg-zinc-200 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button 
                  onClick={onLogout}
                  className="text-zinc-500 hover:text-red-600 transition-colors"
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

const LandingPage = () => {
  return (
    <div className="min-h-screen">
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
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        onLogin(data.user);
        navigate('/');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Something went wrong');
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
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="vademo@email.com or edemo@dmail.com"
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
              placeholder="vademo or edemo"
              required
            />
          </div>
          <button className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-md">
            Log In
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
  const [role, setRole] = useState<UserRole>('va');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });
      const data = await res.json();
      if (res.ok) {
        onLogin(data.user);
        navigate('/');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Something went wrong');
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
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button 
              type="button"
              onClick={() => setRole('va')}
              className={cn(
                "py-3 rounded-xl border-2 font-bold transition-all flex flex-col items-center gap-1",
                role === 'va' ? "border-indigo-600 bg-indigo-50 text-indigo-600" : "border-zinc-100 text-zinc-500 hover:border-zinc-200"
              )}
            >
              <User className="w-5 h-5" />
              <span className="text-xs">I'm a VA</span>
            </button>
            <button 
              type="button"
              onClick={() => setRole('employer')}
              className={cn(
                "py-3 rounded-xl border-2 font-bold transition-all flex flex-col items-center gap-1",
                role === 'employer' ? "border-indigo-600 bg-indigo-50 text-indigo-600" : "border-zinc-100 text-zinc-500 hover:border-zinc-200"
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
          <button className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-md">
            Create Account
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

const AdminDashboard = ({ user }: { user: UserData }) => {
  const [stats, setStats] = useState<any>(null);
  const [pendingJobs, setPendingJobs] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'logs'>('overview');
  const [rejectingJobId, setRejectingJobId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [userFormData, setUserFormData] = useState({ name: '', email: '', password: '', role: 'va' as UserRole, status: 'approved' });

  const fetchData = useCallback(() => {
    fetch('/api/admin/stats').then(res => res.json()).then(setStats);
    fetch('/api/admin/pending-jobs').then(res => res.json()).then(setPendingJobs);
    fetch(`/api/admin/users?search=${userSearch}`).then(res => res.json()).then(setUsers);
    fetch('/api/admin/logs').then(res => res.json()).then(setLogs);
  }, [userSearch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingUser ? `/api/admin/users/${editingUser.id}` : '/api/admin/users';
    const method = editingUser ? 'PUT' : 'POST';
    
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...userFormData, admin_id: user.id })
    });
    
    if (res.ok) {
      setShowUserModal(false);
      setEditingUser(null);
      setUserFormData({ name: '', email: '', password: '', role: 'va', status: 'approved' });
      fetchData();
    } else {
      const data = await res.json();
      alert(data.error || 'Failed to save user');
    }
  };

  const openEditModal = (u: any) => {
    setEditingUser(u);
    setUserFormData({ name: u.name, email: u.email, password: '', role: u.role, status: u.status });
    setShowUserModal(true);
  };

  const openAddModal = () => {
    setEditingUser(null);
    setUserFormData({ name: '', email: '', password: '', role: 'va', status: 'approved' });
    setShowUserModal(true);
  };

  const approveJob = async (id: string) => {
    await fetch('/api/admin/approve-job', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, admin_id: user.id })
    });
    fetchData();
  };

  const rejectJob = async () => {
    if (!rejectingJobId) return;
    await fetch('/api/admin/reject-job', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: rejectingJobId, reason: rejectionReason, admin_id: user.id })
    });
    setRejectingJobId(null);
    setRejectionReason('');
    fetchData();
  };

  const updateUserStatus = async (id: string, status: string) => {
    await fetch('/api/admin/update-user-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status, admin_id: user.id })
    });
    fetchData();
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    await fetch('/api/admin/delete-user', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, admin_id: user.id })
    });
    fetchData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">Admin Control Center</h1>
        <div className="flex bg-white p-1 rounded-xl border border-zinc-200">
          <button 
            onClick={() => setActiveTab('overview')}
            className={cn("px-4 py-2 rounded-lg text-sm font-bold transition-all", activeTab === 'overview' ? "bg-teal-600 text-white" : "text-zinc-500 hover:text-zinc-900")}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={cn("px-4 py-2 rounded-lg text-sm font-bold transition-all", activeTab === 'users' ? "bg-teal-600 text-white" : "text-zinc-500 hover:text-zinc-900")}
          >
            Users
          </button>
          <button 
            onClick={() => setActiveTab('logs')}
            className={cn("px-4 py-2 rounded-lg text-sm font-bold transition-all", activeTab === 'logs' ? "bg-teal-600 text-white" : "text-zinc-500 hover:text-zinc-900")}
          >
            Logs
          </button>
        </div>
      </div>
      
      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Total VAs', value: stats?.totalVAs?.count || 0, icon: Users, color: 'text-blue-600' },
              { label: 'Total Employers', value: stats?.totalEmployers?.count || 0, icon: Briefcase, color: 'text-teal-600' },
              { label: 'Total Jobs', value: stats?.totalJobs?.count || 0, icon: BarChart3, color: 'text-emerald-600' },
              { label: 'Pending Approvals', value: stats?.pendingJobs?.count || 0, icon: Clock, color: 'text-amber-600' },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className={cn("p-2 rounded-lg bg-zinc-50", stat.color)}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-zinc-900">{stat.value}</div>
                <div className="text-sm font-medium text-zinc-500">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-100">
              <h2 className="text-xl font-bold text-zinc-900">Pending Job Approvals</h2>
            </div>
            <div className="divide-y divide-zinc-100">
              {pendingJobs.length === 0 ? (
                <div className="p-12 text-center text-zinc-500">No pending jobs to review.</div>
              ) : (
                pendingJobs.map((job) => (
                  <div key={job.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-zinc-50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-zinc-900">{job.title}</h3>
                        <span className="text-[10px] bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded uppercase font-bold">{job.job_type}</span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500">
                        <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {job.company_name}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Posted {new Date(job.created_at).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> ${job.salary_min} - ${job.salary_max}</span>
                      </div>
                      <p className="mt-2 text-sm text-zinc-600 line-clamp-1">{job.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => approveJob(job.id)}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-700 transition-all"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => setRejectingJobId(job.id)}
                        className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-100 transition-all"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-zinc-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-zinc-900">User Management</h2>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input 
                  type="text" 
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search users..."
                  className="w-full pl-10 pr-4 py-2 border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <button 
                onClick={openAddModal}
                className="bg-teal-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-teal-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add User
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-zinc-900">{u.name}</div>
                      <div className="text-xs text-zinc-500">{u.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "text-[10px] font-bold uppercase px-2 py-1 rounded",
                        u.role === 'va' ? "bg-blue-50 text-blue-600" : "bg-teal-50 text-teal-600"
                      )}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "text-[10px] font-bold uppercase px-2 py-1 rounded",
                        u.status === 'approved' ? "bg-emerald-50 text-emerald-600" : 
                        u.status === 'pending' ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"
                      )}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-500">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => openEditModal(u)} className="text-xs font-bold text-teal-600 hover:underline">Edit</button>
                      {u.status !== 'approved' && (
                        <button onClick={() => updateUserStatus(u.id, 'approved')} className="text-xs font-bold text-emerald-600 hover:underline">Approve</button>
                      )}
                      {u.status !== 'suspended' && (
                        <button onClick={() => updateUserStatus(u.id, 'suspended')} className="text-xs font-bold text-amber-600 hover:underline">Suspend</button>
                      )}
                      <button onClick={() => deleteUser(u.id)} className="text-xs font-bold text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-zinc-100">
            <h2 className="text-xl font-bold text-zinc-900">Admin Activity Logs</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Admin</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {logs.map((log) => (
                  <tr key={log.id} className="text-sm">
                    <td className="px-6 py-4 font-medium text-zinc-900">{log.admin_name}</td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold uppercase bg-zinc-100 text-zinc-600 px-2 py-1 rounded">
                        {log.action_type.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-600">{log.description}</td>
                    <td className="px-6 py-4 text-zinc-500">{new Date(log.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* User Modal */}
      <AnimatePresence>
        {showUserModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowUserModal(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative z-10 p-6">
              <h3 className="text-lg font-bold text-zinc-900 mb-4">{editingUser ? 'Edit User' : 'Add New User'}</h3>
              <form onSubmit={handleSaveUser} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={userFormData.name}
                    onChange={(e) => setUserFormData({...userFormData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Email</label>
                  <input 
                    type="email" 
                    value={userFormData.email}
                    onChange={(e) => setUserFormData({...userFormData, email: e.target.value})}
                    className="w-full px-4 py-2 border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
                {!editingUser && (
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Password</label>
                    <input 
                      type="password" 
                      value={userFormData.password}
                      onChange={(e) => setUserFormData({...userFormData, password: e.target.value})}
                      className="w-full px-4 py-2 border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Role</label>
                    <select 
                      value={userFormData.role}
                      onChange={(e) => setUserFormData({...userFormData, role: e.target.value as UserRole})}
                      className="w-full px-4 py-2 border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="va">VA</option>
                      <option value="employer">Employer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Status</label>
                    <select 
                      value={userFormData.status}
                      onChange={(e) => setUserFormData({...userFormData, status: e.target.value})}
                      className="w-full px-4 py-2 border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="approved">Approved</option>
                      <option value="pending">Pending</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="submit" className="flex-1 bg-teal-600 text-white py-2 rounded-lg font-bold hover:bg-teal-700">Save User</button>
                  <button type="button" onClick={() => setShowUserModal(false)} className="flex-1 bg-zinc-100 text-zinc-600 py-2 rounded-lg font-bold hover:bg-zinc-200">Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Rejection Modal */}
      <AnimatePresence>
        {rejectingJobId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setRejectingJobId(null)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative z-10 p-6">
              <h3 className="text-lg font-bold text-zinc-900 mb-4">Reject Job Listing</h3>
              <textarea 
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Provide a reason for rejection..."
                className="w-full h-32 p-3 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500 mb-4"
              />
              <div className="flex gap-3">
                <button onClick={rejectJob} className="flex-1 bg-red-600 text-white py-2 rounded-lg font-bold hover:bg-red-700">Confirm Reject</button>
                <button onClick={() => setRejectingJobId(null)} className="flex-1 bg-zinc-100 text-zinc-600 py-2 rounded-lg font-bold hover:bg-zinc-200">Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
            <h3 className="text-lg font-bold mb-2">Current Plan: Free</h3>
            <p className="text-indigo-100 text-sm mb-6">Upgrade to Premium for unlimited job posts and direct messaging.</p>
            <Link to="/pricing" className="block w-full text-center bg-white text-indigo-600 py-2 rounded-lg font-bold hover:bg-indigo-50 transition-all">
              Upgrade Plan
            </Link>
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
                  <label className="block text-sm font-bold text-zinc-700 mb-1">Job Title / Heading</label>
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
                  <label className="block text-sm font-bold text-zinc-700 mb-1">Job Description</label>
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
                    <label className="block text-sm font-bold text-zinc-700 mb-1">Min Monthly Salary (USD $)</label>
                    <input 
                      type="number" 
                      value={salaryMin}
                      onChange={(e) => setSalaryMin(e.target.value)}
                      className="w-full px-4 py-2 border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-1">Max Monthly Salary (USD $)</label>
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
              Filter by skills:
            </h3>
            <div className="mb-2 text-[10px] font-bold text-teal-600 uppercase">SELECT UP TO 3 SKILLS</div>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for skills"
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
    const savedUser = localStorage.getItem('vahub_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData: UserData) => {
    setUser(userData);
    localStorage.setItem('vahub_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('vahub_user');
  };

  if (loading) return null;

  return (
    <Router>
      <div className="min-h-screen bg-zinc-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
        <Navbar user={user} onLogout={handleLogout} />
        
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/jobs" element={<JobsPage user={user} />} />
            <Route path="/jobs/:id" element={<JobDetailsPage user={user} />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} />} />
            <Route path="/register" element={user ? <Navigate to="/" /> : <RegisterPage onLogin={handleLogin} />} />
            
            {/* Protected Routes */}
            <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard user={user} /> : <Navigate to="/login" />} />
            <Route path="/employer" element={user?.role === 'employer' ? <EmployerDashboard user={user} /> : <Navigate to="/login" />} />
            <Route path="/va" element={user?.role === 'va' ? <VADashboard user={user} /> : <Navigate to="/login" />} />
            
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
