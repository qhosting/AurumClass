export type UserRole = 'admin' | 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  teacherId: string;
  credits?: number;
}

export interface Enrollment {
  id: string;
  studentId: string;
  subjectId: string;
  semester: string;
  grade?: number;
}
