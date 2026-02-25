import express from "express";
import { createServer as createViteServer } from "vite";
import db from "./src/db.ts";
import { v4 as uuidv4 } from "uuid";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API ROUTES ---

  // Auth
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    console.log(`Login attempt for: ${email}`);
    try {
      const user = db.prepare("SELECT * FROM users WHERE email = ? AND password = ?").get(email, password) as any;
      if (user) {
        console.log(`Login successful for: ${email}`);
        res.json({ user });
      } else {
        console.log(`Login failed for: ${email} - Invalid credentials`);
        res.status(401).json({ error: "Invalid credentials" });
      }
    } catch (err: any) {
      console.error(`Login error for ${email}:`, err.message);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/auth/register", (req, res) => {
    const { name, email, password, role } = req.body;
    console.log(`Registration attempt for: ${email} as ${role}`);
    const id = uuidv4();
    try {
      db.prepare("INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)").run(id, name, email, password, role);
      
      if (role === 'va') {
        db.prepare("INSERT INTO va_profiles (id, user_id) VALUES (?, ?)").run(uuidv4(), id);
      } else if (role === 'employer') {
        db.prepare("INSERT INTO employer_profiles (id, user_id) VALUES (?, ?)").run(uuidv4(), id);
      }
      
      const user = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
      console.log(`Registration successful for: ${email}`);
      res.json({ user });
    } catch (e: any) {
      console.error(`Registration error for ${email}:`, e.message);
      res.status(400).json({ error: e.message.includes("UNIQUE") ? "Email already exists" : "Registration failed" });
    }
  });

  // Jobs
  app.get("/api/jobs", (req, res) => {
    const jobs = db.prepare(`
      SELECT jobs.*, employer_profiles.company_name, employer_profiles.logo_url 
      FROM jobs 
      JOIN employer_profiles ON jobs.employer_id = employer_profiles.user_id
      WHERE jobs.status = 'approved'
      ORDER BY jobs.is_featured DESC, jobs.created_at DESC
    `).all() as any[];

    const jobsWithSkills = jobs.map(job => {
      const skills = db.prepare("SELECT skill_name FROM job_skills WHERE job_id = ?").all(job.id as string) as any[];
      return { ...job, skills: skills.map(s => s.skill_name) };
    });

    res.json(jobsWithSkills);
  });

  app.get("/api/jobs/:id", (req, res) => {
    const job = db.prepare(`
      SELECT jobs.*, employer_profiles.company_name, employer_profiles.company_description, employer_profiles.logo_url 
      FROM jobs 
      JOIN employer_profiles ON jobs.employer_id = employer_profiles.user_id
      WHERE jobs.id = ?
    `).get(req.params.id) as any;

    if (!job) return res.status(404).json({ error: "Job not found" });

    const skills = db.prepare("SELECT skill_name FROM job_skills WHERE job_id = ?").all(job.id) as any[];
    res.json({ ...job, skills: skills.map(s => s.skill_name) });
  });

  app.post("/api/applications", (req, res) => {
    const { job_id, va_id, cover_letter } = req.body;
    const id = uuidv4();
    try {
      db.prepare(`
        INSERT INTO applications (id, job_id, va_id, cover_letter)
        VALUES (?, ?, ?, ?)
      `).run(id, job_id, va_id, cover_letter);
      res.json({ id });
    } catch (e) {
      res.status(400).json({ error: "Application failed" });
    }
  });

  app.post("/api/jobs", (req, res) => {
    const { employer_id, title, description, salary_min, salary_max, job_type, experience_level } = req.body;
    const id = uuidv4();
    db.prepare(`
      INSERT INTO jobs (id, employer_id, title, description, salary_min, salary_max, job_type, experience_level)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, employer_id, title, description, salary_min, salary_max, job_type, experience_level);
    res.json({ id });
  });

  // Admin
  app.get("/api/admin/stats", (req, res) => {
    const stats = {
      totalVAs: db.prepare("SELECT count(*) as count FROM users WHERE role = 'va'").get() as any,
      totalEmployers: db.prepare("SELECT count(*) as count FROM users WHERE role = 'employer'").get() as any,
      totalJobs: db.prepare("SELECT count(*) as count FROM jobs").get() as any,
      pendingJobs: db.prepare("SELECT count(*) as count FROM jobs WHERE status = 'pending'").get() as any,
    };
    res.json(stats);
  });

  app.get("/api/admin/pending-jobs", (req, res) => {
    const jobs = db.prepare(`
      SELECT jobs.*, employer_profiles.company_name 
      FROM jobs 
      JOIN employer_profiles ON jobs.employer_id = employer_profiles.user_id
      WHERE jobs.status = 'pending'
      ORDER BY jobs.created_at DESC
    `).all();
    res.json(jobs);
  });

  app.post("/api/admin/approve-job", (req, res) => {
    const { id, admin_id } = req.body;
    db.prepare("UPDATE jobs SET status = 'approved' WHERE id = ?").run(id);
    
    db.prepare("INSERT INTO admin_logs (id, admin_id, action_type, description) VALUES (?, ?, ?, ?)")
      .run(uuidv4(), admin_id, 'job_approved', `Approved job: ${id}`);
      
    res.json({ success: true });
  });

  app.post("/api/admin/reject-job", (req, res) => {
    const { id, reason, admin_id } = req.body;
    db.prepare("UPDATE jobs SET status = 'rejected', rejection_reason = ? WHERE id = ?").run(reason, id);
    
    db.prepare("INSERT INTO admin_logs (id, admin_id, action_type, description) VALUES (?, ?, ?, ?)")
      .run(uuidv4(), admin_id, 'job_rejected', `Rejected job: ${id}. Reason: ${reason}`);
      
    res.json({ success: true });
  });

  app.get("/api/admin/users", (req, res) => {
    const { search } = req.query;
    let query = "SELECT id, name, email, role, status, created_at FROM users WHERE role != 'admin'";
    let params: any[] = [];
    
    if (search) {
      query += " AND (name LIKE ? OR email LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }
    
    const users = db.prepare(query).all(...params);
    res.json(users);
  });

  app.post("/api/admin/update-user-status", (req, res) => {
    const { id, status, admin_id } = req.body;
    db.prepare("UPDATE users SET status = ? WHERE id = ?").run(status, id);
    
    db.prepare("INSERT INTO admin_logs (id, admin_id, action_type, target_user_id, description) VALUES (?, ?, ?, ?, ?)")
      .run(uuidv4(), admin_id, 'user_status_updated', id, `Updated user status to ${status}`);
      
    res.json({ success: true });
  });

  app.delete("/api/admin/delete-user", (req, res) => {
    const { id, admin_id } = req.body;
    db.prepare("DELETE FROM users WHERE id = ?").run(id);
    
    db.prepare("INSERT INTO admin_logs (id, admin_id, action_type, target_user_id, description) VALUES (?, ?, ?, ?, ?)")
      .run(uuidv4(), admin_id, 'user_deleted', id, `Deleted user: ${id}`);
      
    res.json({ success: true });
  });

  app.get("/api/admin/logs", (req, res) => {
    const logs = db.prepare(`
      SELECT admin_logs.*, users.name as admin_name 
      FROM admin_logs 
      JOIN users ON admin_logs.admin_id = users.id 
      ORDER BY admin_logs.created_at DESC 
      LIMIT 100
    `).all();
    res.json(logs);
  });

  // VA Profiles
  app.get("/api/talents", (req, res) => {
    const profiles = db.prepare(`
      SELECT va_profiles.*, users.name, users.email 
      FROM va_profiles 
      JOIN users ON va_profiles.user_id = users.id
      WHERE users.status = 'approved'
    `).all() as any[];

    const profilesWithSkills = profiles.map(profile => {
      const skills = db.prepare("SELECT skill_name, years_experience FROM va_skills WHERE va_id = ?").all(profile.user_id) as any[];
      return { ...profile, skills };
    });

    res.json(profilesWithSkills);
  });

  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
