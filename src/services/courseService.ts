// src/services/courseService.ts
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, query, orderBy, where, setDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import type { Course, Module, Lesson, UserLessonProgress, ActionItem } from '@/lib/types';

// --- Course Functions ---
export async function getCourses(): Promise<Course[]> {
  const coursesCol = collection(db, 'courses');
  const q = query(coursesCol, orderBy('order', 'asc')); // Add an 'order' field to your course docs
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
}

export async function getCourseById(courseId: string): Promise<Course | null> {
  const courseRef = doc(db, 'courses', courseId);
  const courseSnap = await getDoc(courseRef);
  return courseSnap.exists() ? ({ id: courseSnap.id, ...courseSnap.data() } as Course) : null;
}

// --- Module Functions ---
export async function getModulesForCourse(courseId: string): Promise<Module[]> {
  const modulesCol = collection(db, `courses/${courseId}/modules`);
  const q = query(modulesCol, orderBy('order', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, courseId, ...doc.data() } as Module));
}

// --- Lesson Functions ---
export async function getLessonsForModule(courseId: string, moduleId: string): Promise<Lesson[]> {
  const lessonsCol = collection(db, `courses/${courseId}/modules/${moduleId}/lessons`);
  const q = query(lessonsCol, orderBy('order', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, courseId, moduleId, ...doc.data() } as Lesson));
}

export async function getLessonById(courseId: string, moduleId: string, lessonId: string): Promise<Lesson | null> {
  const lessonRef = doc(db, `courses/${courseId}/modules/${moduleId}/lessons`, lessonId);
  const lessonSnap = await getDoc(lessonRef);
  return lessonSnap.exists() ? ({ id: lessonSnap.id, courseId, moduleId, ...lessonSnap.data() } as Lesson) : null;
}

// --- User Progress Functions ---
export async function getUserLessonProgress(userId: string, lessonId: string): Promise<UserLessonProgress | null> {
  const progressRef = doc(db, `users/${userId}/lessonProgress`, lessonId);
  const progressSnap = await getDoc(progressRef);
  return progressSnap.exists() ? (progressSnap.data() as UserLessonProgress) : null;
}

export async function setUserLessonProgress(
  userId: string,
  courseId: string,
  moduleId: string,
  lessonId: string,
  completed: boolean,
  actionItemsStatus?: Record<string, boolean>
): Promise<void> {
  const progressRef = doc(db, `users/${userId}/lessonProgress`, lessonId);
  const data: Partial<UserLessonProgress> = {
    userId,
    lessonId,
    courseId,
    moduleId,
    completed,
    completedAt: completed ? serverTimestamp() : undefined,
  };
  if (actionItemsStatus !== undefined) { // Ensure we only set it if provided
    data.actionItemsStatus = actionItemsStatus;
  }
  await setDoc(progressRef, data, { merge: true });
}

// Optional: Get all lesson progress for a user in a course for calculating course completion
export async function getCourseProgressForUser(userId: string, courseId: string): Promise<Record<string, UserLessonProgress>> {
    const lessonProgressCol = collection(db, `users/${userId}/lessonProgress`);
    const q = query(lessonProgressCol, where("courseId", "==", courseId));
    const snapshot = await getDocs(q);
    const progressMap: Record<string, UserLessonProgress> = {};
    snapshot.docs.forEach(d => {
        progressMap[d.id] = d.data() as UserLessonProgress;
    });
    return progressMap;
}