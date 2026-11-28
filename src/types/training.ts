export interface TrainingCurriculumModule {
  title: string;
  description: string;
  hours: number;
}

export interface TrainingTrainer {
  name: string;
  designation: string;
  image: string;
  bio: string;
}

export interface TrainingCertification {
  provided: boolean;
  name: string;
  description: string;
}

export interface TrainingFAQ {
  question: string;
  answer: string;
}

export interface TrainingSEO {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
}

export interface Training {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  featuredImage: string;
  category: string;
  duration: string;
  trainingMode: 'Online' | 'Offline' | 'Hybrid';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  technologies: string[];
  price: number;
  paymentType: 'Free' | 'Paid';
  amount: number;
  currency: string;
  startDate?: string;
  endDate?: string;
  isFree: boolean;
  prerequisites: string[];
  targetAudience: string[];
  learningOutcomes: string[];
  curriculum: TrainingCurriculumModule[];
  trainer: TrainingTrainer;
  certification: TrainingCertification;
  faqs: TrainingFAQ[];
  status: 'draft' | 'published' | 'inactive';
  isFeatured: boolean;
  displayOrder: number;
  seo: TrainingSEO;
  createdAt: string;
  updatedAt: string;
}

export interface TrainingListItem {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  featuredImage: string;
  category: string;
  duration: string;
  trainingMode: 'Online' | 'Offline' | 'Hybrid';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  technologies: string[];
  price: number;
  paymentType: 'Free' | 'Paid';
  amount: number;
  currency: string;
  isFree: boolean;
  trainer: TrainingTrainer;
  certification: TrainingCertification;
  createdAt: string;
}

export interface TrainingListResponse {
  success: boolean;
  data: TrainingListItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface TrainingDetailResponse {
  success: boolean;
  data: Training;
}

export interface Enrollment {
  _id: string;
  candidateName: string;
  email: string;
  mobile: string;
  qualification: string;
  organization: string;
  message?: string;
  trainingId: string;
  /** Populated by GET /api/training/enrollment/:id */
  training?: Training | null;
  courseTitleSnapshot: string;
  amount: number;
  currency: string;
  paymentType: 'Free' | 'Paid';
  enrollmentStatus: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'cancelled';
  razorpayOrderId: string;
  razorpayPaymentId: string;
  transactionId: string;
  enrolledAt: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnrollmentFormData {
  candidateName: string;
  email: string;
  mobile: string;
  qualification: string;
  organization: string;
  message: string;
}

export interface RazorpayOrderResponse {
  success: boolean;
  data: {
    orderId: string;
    amount: number;
    currency: string;
    keyId: string;
    enrollmentId: string;
    transactionId: string;
  };
}

export interface PaymentStatusResponse {
  success: boolean;
  data: {
    _id: string;
    enrollmentId: string;
    paymentStatus: 'pending' | 'paid' | 'failed' | 'cancelled';
    razorpayPaymentId?: string;
    razorpayOrderId?: string;
    transactionId: string;
    amount: number;
    currency: string;
    updatedAt: string;
  };
}

export interface EnrollmentResponse {
  success: boolean;
  data: {
    enrollmentId: string;
    transactionId: string;
    accessToken: string;
    paymentStatus: 'pending' | 'paid' | 'failed' | 'cancelled';
    enrollmentStatus: 'pending' | 'confirmed' | 'cancelled';
    amount: number;
    currency: string;
    paymentRequired: boolean;
    redirectUrl: string;
  };
}

export interface AdminEnrollment {
  _id: string;
  candidateName: string;
  email: string;
  mobile: string;
  qualification: string;
  organization: string;
  message?: string;
  trainingId: string | { _id: string; title: string };
  courseTitleSnapshot: string;
  amount: number;
  currency: string;
  paymentType: 'Free' | 'Paid';
  enrollmentStatus: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'cancelled';
  razorpayOrderId: string;
  razorpayPaymentId: string;
  transactionId: string;
  enrolledAt: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnrollmentStats {
  totalEnrollments: number;
  totalRevenue: number;
  totalSuccessfulPayments: number;
  totalPendingPayments: number;
  courseWiseCount: Array<{ course: string; count: number }>;
}

export interface CandidatePayment {
  _id?: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignatureVerified: boolean;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'cancelled';
  failureReason: string;
  transactionId: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CandidateTraining {
  _id: string;
  title: string;
  slug: string;
  featuredImage?: string;
  category: string;
  duration: string;
  trainingMode: string;
  level: string;
  technologies: string[];
  price: number;
  paymentType: 'Free' | 'Paid';
  amount: number;
  currency: string;
  isFree: boolean;
  startDate?: string;
  endDate?: string;
  trainer?: any;
  certification?: any;
  description?: string;
  shortDescription?: string;
}

export interface CandidateListItem {
  _id: string;
  candidateName: string;
  email: string;
  mobile: string;
  qualification: string;
  organization: string;
  message?: string;
  trainingId: string | { _id: string; title: string };
  courseTitleSnapshot: string;
  amount: number;
  currency: string;
  paymentType: 'Free' | 'Paid';
  enrollmentStatus: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'cancelled';
  razorpayOrderId: string;
  razorpayPaymentId: string;
  transactionId: string;
  enrolledAt: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
  training?: CandidateTraining | null;
}

export interface CandidateDetail {
  _id: string;
  candidateName: string;
  email: string;
  mobile: string;
  qualification: string;
  organization: string;
  message?: string;
  trainingId: string;
  courseTitleSnapshot: string;
  amount: number;
  currency: string;
  paymentType: 'Free' | 'Paid';
  enrollmentStatus: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'cancelled';
  razorpayOrderId: string;
  razorpayPaymentId: string;
  transactionId: string;
  enrolledAt: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
  training: CandidateTraining | null;
  payment: CandidatePayment | null;
}

export interface CandidatesResponse {
  success: boolean;
  data: CandidateListItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface CandidateDetailResponse {
  success: boolean;
  data: CandidateDetail;
}
