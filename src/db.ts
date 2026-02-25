import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const db = new Database('vahub.db');

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    role TEXT CHECK(role IN ('admin', 'employer', 'va')) NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'suspended')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS va_profiles (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    headline TEXT,
    bio TEXT,
    hourly_rate REAL,
    availability TEXT,
    experience_years INTEGER,
    intro_video_url TEXT,
    resume_url TEXT,
    profile_views INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS employer_profiles (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    company_name TEXT,
    company_description TEXT,
    website TEXT,
    industry TEXT,
    team_size TEXT,
    logo_url TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    employer_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    salary_min REAL,
    salary_max REAL,
    job_type TEXT,
    experience_level TEXT,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected', 'closed')),
    is_featured BOOLEAN DEFAULT 0,
    rejection_reason TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employer_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS admin_logs (
    id TEXT PRIMARY KEY,
    admin_id TEXT NOT NULL,
    action_type TEXT NOT NULL,
    target_user_id TEXT,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS applications (
    id TEXT PRIMARY KEY,
    job_id TEXT NOT NULL,
    va_id TEXT NOT NULL,
    cover_letter TEXT,
    status TEXT DEFAULT 'applied' CHECK(status IN ('applied', 'shortlisted', 'rejected', 'hired')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id),
    FOREIGN KEY (va_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS subscriptions (
    id TEXT PRIMARY KEY,
    employer_id TEXT NOT NULL,
    plan_id TEXT NOT NULL,
    status TEXT,
    current_period_end DATETIME,
    FOREIGN KEY (employer_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS plans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    job_post_limit INTEGER,
    messaging_limit INTEGER,
    candidate_unlock_limit INTEGER,
    featured_jobs_limit INTEGER
  );

  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    sender_id TEXT NOT NULL,
    receiver_id TEXT NOT NULL,
    message_body TEXT NOT NULL,
    is_flagged BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (receiver_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS job_skills (
    id TEXT PRIMARY KEY,
    job_id TEXT NOT NULL,
    skill_name TEXT NOT NULL,
    FOREIGN KEY (job_id) REFERENCES jobs(id)
  );
`);

// Seed default plans if they don't exist
const plansCount = db.prepare('SELECT count(*) as count FROM plans').get() as { count: number };
if (plansCount.count === 0) {
  const insertPlan = db.prepare('INSERT INTO plans (id, name, price, job_post_limit, messaging_limit, candidate_unlock_limit, featured_jobs_limit) VALUES (?, ?, ?, ?, ?, ?, ?)');
  insertPlan.run('free', 'Free', 0, 1, 5, 2, 0);
  insertPlan.run('premium', 'Premium', 29, 9999, 9999, 9999, 10);
}

// Seed admin if not exists
const adminCount = db.prepare('SELECT count(*) as count FROM users WHERE role = ?').get('admin') as { count: number };
if (adminCount.count === 0) {
  db.prepare('INSERT INTO users (id, role, name, email, password, status) VALUES (?, ?, ?, ?, ?, ?)').run(
    'admin-1', 'admin', 'System Admin', 'admin@vahub.com', 'admin123', 'approved'
  );
}

// Seed demo accounts
const vaDemoCount = db.prepare('SELECT count(*) as count FROM users WHERE email = ?').get('vademo@email.com') as { count: number };
if (vaDemoCount.count === 0) {
  const vaId = 'va-demo-1';
  db.prepare('INSERT INTO users (id, role, name, email, password, status) VALUES (?, ?, ?, ?, ?, ?)').run(
    vaId, 'va', 'Demo VA', 'vademo@email.com', 'vademo', 'approved'
  );
  db.prepare('INSERT INTO va_profiles (id, user_id, headline, bio, hourly_rate) VALUES (?, ?, ?, ?, ?)').run(
    'va-prof-demo', vaId, 'Expert Virtual Assistant', 'I am a demo VA profile with extensive experience in administrative tasks.', 15
  );
}

const employerDemoCount = db.prepare('SELECT count(*) as count FROM users WHERE email = ?').get('edemo@dmail.com') as { count: number };
if (employerDemoCount.count === 0) {
  const empId = 'employer-demo-1';
  db.prepare('INSERT INTO users (id, role, name, email, password, status) VALUES (?, ?, ?, ?, ?, ?)').run(
    empId, 'employer', 'Demo Employer', 'edemo@dmail.com', 'edemo', 'approved'
  );
  db.prepare('INSERT INTO employer_profiles (id, user_id, company_name, industry) VALUES (?, ?, ?, ?)').run(
    'emp-prof-demo', empId, 'Demo Corp', 'Technology'
  );
}

// Seed sample jobs
const sampleJobsCount = db.prepare('SELECT count(*) as count FROM jobs').get() as { count: number };
if (sampleJobsCount.count <= 1) { // Only seed if empty or just the one from previous test
  const employerId = 'employer-demo-1';
  const insertJob = db.prepare(`
    INSERT INTO jobs (id, employer_id, title, description, salary_min, salary_max, job_type, experience_level, status, is_featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'approved', ?)
  `);

  const jobsData = [
    { id: 'j1', title: 'Warm-Call Appointment Setter – Remote', desc: 'Are you a great communicator who enjoys talking to people and making a positive impact? We are looking for a Warm-Call Appointment Setter to join...', min: 1000, max: 1200, type: 'Full-Time', featured: 1 },
    { id: 'j2', title: 'Warm Call Appointment Setter (NO COLD CALLING!)', desc: 'Are you a great communicator who enjoys talking to people and making a positive impact? We are looking for a Warm-Call Appointment...', min: 1000, max: 1200, type: 'Full-Time', featured: 0 },
    { id: 'j3', title: 'Full-Time Remote Sales Specialist (Chat-Based)', desc: 'We are a growing U.S.-based inventory buying company looking for a full-time chat-based Sales Specialist.', min: 800, max: 2500, type: 'Full-Time', featured: 1 },
    { id: 'j4', title: 'Assistant for Property Management', desc: 'We are seeking an organized and proactive Assistant to support our property management operations.', min: 650, max: 900, type: 'Full-Time', featured: 0 },
    { id: 'j5', title: 'Virtual Real Estate Assistant/Admin', desc: 'The Harbert Real Estate Group is a fast-growing real estate company, and we are currently seeking a dedicated, organized, and proactive Virtual Real Estate Assistant/Admin.', min: 500, max: 500, type: 'Full-Time', featured: 0 },
    { id: 'j6', title: 'Transaction Coordinator (FLUENT ENGLISH)', desc: 'MUST HAVE GREAT ENGLISH AS THIS IS A CLIENT RELATIONS POSITION. Texas-based real estate experience preferred.', min: 650, max: 800, type: 'Full-Time', featured: 0 },
    { id: 'j7', title: 'Multiple Virtual Assistant Roles!', desc: 'Team Growth are expanding. Open Roles: General Admin REVA, Executive Assistant, Marketing/Graphics VA, ISA Caller.', min: 500, max: 1000, type: 'Full-Time', featured: 0 },
    { id: 'j8', title: 'Digital Products VA — Etsy Store Builder', desc: 'We are a growing digital products and e-commerce company. We need someone exceptional to grow with us.', min: 400, max: 700, type: 'Full-Time', featured: 0 },
    { id: 'j9', title: 'Excel & Data Management Virtual Assistant', desc: 'We are looking for a dedicated Virtual Assistant with advanced Excel skills to join our team.', min: 800, max: 800, type: 'Full-Time', featured: 0 },
    { id: 'j10', title: 'Social Media Video Editor (AI TikTok)', desc: 'Hiring immediately! We are looking for a full-time Social Media Content Creator who specializes in creating AI-generated TikTok videos at scale.', min: 700, max: 700, type: 'Full-Time', featured: 1 },
    { id: 'j11', title: 'SALES CLOSER - Buying from Sellers', desc: 'This is NOT a basic Sales VA or admin role. This is a real sales closer position for someone who is hungry and coachable.', min: 800, max: 2500, type: 'Full-Time', featured: 0 },
    { id: 'j12', title: 'Senior Full Stack Developer', desc: 'We’re Acore Technology, a business technology and ERP solutions firm. Custom ERP systems, workflow automation.', min: 850, max: 1625, type: 'Full-Time', featured: 1 },
    { id: 'j13', title: 'Graphic Designer - 3 Month Project', desc: 'Arispheris is looking for a highly skilled and innovative Graphic Designer to join our team for a 3-month full-time project.', min: 700, max: 700, type: 'Full-Time', featured: 0 },
    { id: 'j14', title: 'Life Insurance Salesman', desc: 'All leads are inbound calls to your computer looking for help. Answering client phone calls about premium reduction.', min: 4000, max: 5000, type: 'Gig', featured: 0 },
    { id: 'j15', title: 'Landscape Architect', desc: 'We are seeking a talented and detail-oriented Landscape Architect with at least 5 years of experience.', min: 1000, max: 1500, type: 'Full-Time', featured: 0 },
    { id: 'j16', title: 'Site Planner & Project Manager', desc: 'Responsible for site planning, design, and layout to secure approvals for commercial and industrial projects.', min: 1000, max: 1500, type: 'Full-Time', featured: 0 },
  ];

  for (const job of jobsData) {
    insertJob.run(job.id, employerId, job.title, job.desc, job.min, job.max, job.type, 'Intermediate', job.featured);
  }

  // Seed skills for sample jobs
  const insertSkill = db.prepare('INSERT INTO job_skills (id, job_id, skill_name) VALUES (?, ?, ?)');
  const skillsData = [
    { jobId: 'j1', skills: ['Outbound Sales', 'Cold Calling', 'Sales'] },
    { jobId: 'j2', skills: ['Appointment Setting', 'Sales', 'Outbound Calls'] },
    { jobId: 'j3', skills: ['Inbound Sales', 'Outbound Sales', 'Sales'] },
    { jobId: 'j4', skills: ['Real Estate Marketing', 'Customer Support', 'Property Management'] },
    { jobId: 'j10', skills: ['Video Editing', 'Social Media', 'AI Tools'] },
    { jobId: 'j12', skills: ['React JS', 'Next JS', 'Supabase'] },
    { jobId: 'j13', skills: ['Photoshop', 'Graphic Design', 'Canva'] },
  ];

  for (const data of skillsData) {
    for (const skill of data.skills) {
      insertSkill.run(uuidv4(), data.jobId, skill);
    }
  }
}

export default db;
