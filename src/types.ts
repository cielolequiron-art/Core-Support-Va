export type UserRole = 'ADMIN' | 'EMPLOYER' | 'JOB_SEEKER' | 'MODERATOR' | 'SUPPORT';
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'BANNED' | 'PENDING';
export type JobStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'FLAGGED' | 'EXPIRED';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'none';

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  subscription_status: SubscriptionStatus;
  email_verified: boolean;
  last_login?: string;
  created_at: string;
  avatar_url?: string;
  admin_notes?: string;
  subscription?: {
    plan: string;
    status: string;
    periodEnd?: string;
  };
}

export interface Job {
  id: string;
  employer_id: string;
  title: string;
  description: string;
  type: 'Full-Time' | 'Part-Time' | 'Contract';
  salary_range: string;
  status: JobStatus;
  created_at: string;
  updated_at: string;
  featured: boolean;
  category: string;
  skills: string[];
  applications_count: number;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_name: string;
  price: number;
  start_date: string;
  end_date: string;
  status: SubscriptionStatus;
  payment_method: string;
}

export interface Payment {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: 'SUCCESS' | 'FAILED' | 'REFUNDED' | 'PENDING';
  payment_method: string;
  transaction_id: string;
  created_at: string;
}

export interface Report {
  id: string;
  reporter_id: string;
  target_id: string;
  target_type: 'USER' | 'JOB';
  reason: string;
  status: 'PENDING' | 'REVIEWED' | 'RESOLVED';
  created_at: string;
}

export interface AdminLog {
  id: string;
  admin_id: string;
  action: string;
  target_type: string;
  target_id: string;
  created_at: string;
  details?: string;
}

export interface Role {
  id: string;
  name: UserRole;
  permissions: string[];
}
