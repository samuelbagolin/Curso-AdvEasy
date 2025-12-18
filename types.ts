
export type Role = 'admin' | 'student';

export interface VisualConfig {
  logoUrl: string;
  primaryColor: string;
  backgroundColor: string;
}

export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  role: Role;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  order: number;
  videoUrl?: string;
  imageUrl?: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface Quiz {
  id: string;
  moduleId: string;
  passingScore: number;
  questions: Question[];
}

export interface Module {
  id: string;
  title: string;
  summary: string;
  lessons: Lesson[];
  quiz: Quiz;
  order: number;
}

export interface Course {
  title: string;
  modules: Module[];
}

export interface UserProgress {
  completedLessons: string[];
  passedQuizzes: string[];
}
