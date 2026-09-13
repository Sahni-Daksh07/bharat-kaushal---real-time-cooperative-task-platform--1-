import { SupportedLanguage } from '../utils/i18n';

export type AssessmentCategory =
  | 'Safety'
  | 'Technical Knowledge'
  | 'Troubleshooting'
  | 'Decision Making'
  | 'Tools'
  | 'Quality'
  | 'Preventive Maintenance';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export interface QuestionTranslation {
  question: string;
  options: [string, string, string, string];
  explanation: string;
}

export interface AssessmentQuestion {
  id: string | number;
  field: string;
  category: AssessmentCategory;
  skill_area: string;
  difficulty: DifficultyLevel;
  translations: Record<SupportedLanguage, QuestionTranslation>;
  correctIndex: number; // 0, 1, 2, 3
  source: 'bank' | 'ai'; // INTERNAL ONLY - Never display in worker UI!
}

export type SkillLevelClassification =
  | 'Excellent'
  | 'Skilled'
  | 'Competent'
  | 'Needs Improvement'
  | 'Beginner';

export interface CategoryScoreBreakdown {
  category: AssessmentCategory;
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
}

export interface AssessmentSubmissionResult {
  score: number;
  total: number;
  percentage: number;
  skillLevel: 'Expert' | 'Advanced' | 'Competent' | 'Intermediate' | 'Beginner' | 'Excellent' | 'Skilled' | 'Needs Improvement';
  passed: boolean;
  categoryBreakdown: Record<string, { total: number; correct: number }>;
  questionReview: {
    id: string | number;
    question: string;
    userSelected: number;
    correctAnswer: number;
    isCorrect: boolean;
    explanation: string;
    category: AssessmentCategory;
    difficulty: DifficultyLevel;
  }[];
}

export interface AssessmentResult {
  assessmentId: string;
  workerId: string;
  workerName: string;
  detectedField: string;
  language: SupportedLanguage;
  totalQuestions: number; // 15
  correctAnswers: number;
  incorrectAnswers: number;
  scorePercentage: number;
  skillLevel: SkillLevelClassification;
  categoryBreakdown: Record<AssessmentCategory, { total: number; correct: number; percentage: number }>;
  verifiedSkillsUnlocked: string[];
  submittedAt: string;
  answers: Record<number, number>; // index -> selectedOptionIndex
}

export function classifySkillScore(percentage: number): {
  level: SkillLevelClassification;
  badgeColor: string;
  badgeTextColor: string;
  description: string;
} {
  if (percentage >= 90) {
    return {
      level: 'Excellent',
      badgeColor: 'bg-emerald-500',
      badgeTextColor: 'text-emerald-900',
      description: 'Master craftsman demonstrating high safety, precision, and diagnostic capabilities.',
    };
  } else if (percentage >= 75) {
    return {
      level: 'Skilled',
      badgeColor: 'bg-blue-500',
      badgeTextColor: 'text-blue-900',
      description: 'Highly competent professional capable of independent execution and troubleshooting.',
    };
  } else if (percentage >= 60) {
    return {
      level: 'Competent',
      badgeColor: 'bg-teal-500',
      badgeTextColor: 'text-teal-900',
      description: 'Solid foundational understanding with good trade safety standards.',
    };
  } else if (percentage >= 40) {
    return {
      level: 'Needs Improvement',
      badgeColor: 'bg-amber-500',
      badgeTextColor: 'text-amber-900',
      description: 'Basic practical awareness; further targeted upskilling and module completion recommended.',
    };
  } else {
    return {
      level: 'Beginner',
      badgeColor: 'bg-rose-500',
      badgeTextColor: 'text-rose-900',
      description: 'Entry-level awareness; hands-on apprenticeship recommended before independent dispatch.',
    };
  }
}
