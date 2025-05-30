
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import type { Question } from '@/lib/types';

/**
 * Fetches questions from a specified Firestore collection.
 * @param collectionName The name of the Firestore collection to fetch questions from. Defaults to 'questions'.
 * @returns A promise that resolves to an array of Question objects.
 */
export async function getQuestions(collectionName: string = 'questions'): Promise<Question[]> {
  try {
    const questionsCol = collection(db, collectionName);
    // Sort by 'orderIndex' to ensure questions are displayed in a specific sequence.
    // Ensure your Firestore documents have a numeric 'orderIndex' field.
    const q = query(questionsCol, orderBy('orderIndex')); 
    const querySnapshot = await getDocs(q);
    
    const questions = querySnapshot.docs.map(doc => {
      // Ensure the structure matches the Question type, including the document ID as 'id'
      const data = doc.data();
      return {
        id: doc.id, // Use the document ID as the question's ID
        type: data.type,
        section: data.section,
        stimulus: data.stimulus,
        questionText: data.questionText,
        conclusions: data.conclusions, // For YesNoStatements
        options: data.options, // For MCQ
        correctAnswer: data.correctAnswer,
        explanation: data.explanation,
        orderIndex: data.orderIndex, // Include orderIndex if present in your data
      } as Question; // Type assertion, ensure data matches
    });
    
    return questions;
  } catch (error) {
    console.error("Error fetching questions from Firestore:", error);
    // Depending on your error handling strategy, you might throw the error,
    // return an empty array, or return a specific error object.
    return []; 
  }
}

