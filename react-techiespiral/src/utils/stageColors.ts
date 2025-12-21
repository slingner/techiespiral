import { StartupStage } from '../types/Tool';

/**
 * Consistent color scheme for startup stages across the entire app.
 * Each stage has a unique, recognizable color that helps users
 * quickly identify what phase a tool is best suited for.
 */
export interface StageColors {
  bg: string;
  color: string;
}

export const STAGE_COLORS: Record<StartupStage, StageColors> = {
  validating: {
    bg: 'purple.50',
    color: 'purple.700'
  },
  mvp: {
    bg: 'orange.50',
    color: 'orange.700'
  },
  launched: {
    bg: 'green.50',
    color: 'green.700'
  },
  scaling: {
    bg: 'blue.50',
    color: 'blue.700'
  }
};

export const STAGE_LABELS: Record<StartupStage, string> = {
  validating: 'Validating',
  mvp: 'MVP',
  launched: 'Launched',
  scaling: 'Scaling'
};

/**
 * Get the colors for a given startup stage
 */
export const getStageColors = (stage: StartupStage): StageColors => {
  return STAGE_COLORS[stage] || { bg: 'gray.50', color: 'gray.700' };
};
