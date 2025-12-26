import { StartupStage } from './Tool';

export interface QuizAnswers {
  stages: StartupStage[];
  budgets: string[];
  categories: string[];
}

export interface QuizQuestion {
  id: string;
  title: string;
  subtitle?: string;
  step: number;
  totalSteps: number;
}
