
import { UserProgress, User, Course, VisualConfig } from '../types';
import { INITIAL_USERS, COURSE_DATA, DEFAULT_VISUAL } from '../constants';

const PROGRESS_KEY = 'advocacia_pro_progress_v4';
const USERS_KEY = 'advocacia_pro_users_v4';
const COURSE_KEY = 'advocacia_pro_course_v4';
const VISUAL_KEY = 'advocacia_pro_visual_v4';

export const storageService = {
  getVisualConfig: (): VisualConfig => {
    const saved = localStorage.getItem(VISUAL_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_VISUAL;
  },
  saveVisualConfig: (config: VisualConfig) => {
    localStorage.setItem(VISUAL_KEY, JSON.stringify(config));
  },
  getUsers: (): User[] => {
    const saved = localStorage.getItem(USERS_KEY);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  },
  saveUsers: (users: User[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },
  getCourse: (): Course => {
    const saved = localStorage.getItem(COURSE_KEY);
    return saved ? JSON.parse(saved) : COURSE_DATA;
  },
  saveCourse: (course: Course) => {
    localStorage.setItem(COURSE_KEY, JSON.stringify(course));
  },
  getProgress: (userId: string): UserProgress => {
    const saved = localStorage.getItem(PROGRESS_KEY);
    const allProgress = saved ? JSON.parse(saved) : {};
    return allProgress[userId] || { completedLessons: [], passedQuizzes: [] };
  },
  saveProgress: (userId: string, progress: UserProgress) => {
    const saved = localStorage.getItem(PROGRESS_KEY);
    const allProgress = saved ? JSON.parse(saved) : {};
    allProgress[userId] = progress;
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(allProgress));
  },
  getAllProgress: (): Record<string, UserProgress> => {
    const saved = localStorage.getItem(PROGRESS_KEY);
    return saved ? JSON.parse(saved) : {};
  },
  markLessonComplete: (userId: string, lessonId: string) => {
    const progress = storageService.getProgress(userId);
    if (!progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
      storageService.saveProgress(userId, progress);
    }
    return progress;
  },
  markQuizPassed: (userId: string, quizId: string) => {
    const progress = storageService.getProgress(userId);
    if (!progress.passedQuizzes.includes(quizId)) {
      progress.passedQuizzes.push(quizId);
      storageService.saveProgress(userId, progress);
    }
    return progress;
  }
};
