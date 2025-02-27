import { ActionType } from '../Enums/action.enum';

export type ActivityData = {
  key: string;
  activityId: string;
  title: string;
  reductionMeasures: string;
  status: string;
  natImplementor: string[];
  ghgsAffected?: string;
  achievedReduction?: number;
  estimatedReduction?: number;
  technologyType?: string;
  meansOfImplementation?: string;
};

export type ParentData = {
  id: string;
  title: string;
  hasChildProgrammes: boolean;
};

export type ActivityMigratedData = {
  description: string | undefined;
  type: ActionType | undefined;
  affSectors: string[] | undefined;
  affSubSectors: string[] | undefined;
  // ML - we no longer need these as we are getting it directly in the activity table
  // startYear: number | undefined;
  // endYear: number | undefined;
  // expectedTimeFrame: number | undefined;
};
