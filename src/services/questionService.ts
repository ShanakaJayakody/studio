
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import type { Question, ExamMetadata } from '@/lib/types';

/**
 * Fetches questions from Firestore, optionally filtered by examId.
 * @param collectionName The name of the Firestore collection to fetch questions from. Defaults to 'questions'.
 * @param examId Optional ID of the exam to filter questions for.
 * @returns A promise that resolves to an array of Question objects.
 */
export async function getQuestions(collectionName: string = 'questions', examId?: string): Promise<Question[]> {
  try {
    const questionsCol = collection(db, collectionName);
    let q;

    if (examId) {
      q = query(
        questionsCol,
        where('examIds', 'array-contains', examId),
        orderBy('orderIndex') // Ensure questions are ordered within the specific exam
      );
    } else {
      // Fallback if no examId is provided, though typically you'd always want an examId context
      // For a general question bank view, you might remove the examId filter or sort differently
      q = query(questionsCol, orderBy('orderIndex'));
    }
    
    const querySnapshot = await getDocs(q);
    
    const questions = querySnapshot.docs.map(doc => {
      const data = doc.data();
      // Ensure all fields from the Question type are mapped
      return {
        id: doc.id,
        type: data.type,
        section: data.section,
        stimulus: data.stimulus,
        questionText: data.questionText,
        conclusions: data.conclusions, // Will be undefined if not a YesNoStatementsQuestion, which is fine
        options: data.options,         // Will be undefined if not an MCQQuestion, which is fine
        correctAnswer: data.correctAnswer,
        explanation: data.explanation,
        orderIndex: data.orderIndex,
        examIds: data.examIds,
      } as Question; // Type assertion
    });
    
    return questions;
  } catch (error) {
    console.error("Error fetching questions from Firestore:", error);
    // Check if the error message suggests a missing index
    if (error instanceof Error && error.message.includes("indexes?") || (error instanceof Error && error.message.includes("requires an index"))) {
        console.error("Firestore composite index might be required. Check the Firebase console for a link to create it. The query involves filtering by 'examIds' (array-contains) and ordering by 'orderIndex'.");
    }
    return []; // Return an empty array or throw the error, depending on desired error handling
  }
}

/**
 * Fetches available exams from the 'exams' Firestore collection.
 * @returns A promise that resolves to an array of ExamMetadata objects.
 */
export async function getAvailableExams(): Promise<ExamMetadata[]> {
  try {
    const examsCol = collection(db, 'exams');
    // You might want to order exams, e.g., by title or a specific orderIndex for exams
    const q = query(examsCol, orderBy('title')); 
    const querySnapshot = await getDocs(q);

    const exams = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        section: data.section,
        durationMinutes: data.durationMinutes,
        questionCount: data.questionCount,
      } as ExamMetadata;
    });
    return exams;
  } catch (error) {
    console.error("Error fetching exams from Firestore:", error);
    return [];
  }
}

