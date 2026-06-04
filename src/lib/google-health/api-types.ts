export interface CivilDate {
  year?: number;
  month?: number;
  day?: number;
}

export interface CivilDateTime {
  date?: CivilDate;
  time?: { hours?: number; minutes?: number; seconds?: number };
}

export interface CivilTimeInterval {
  start?: CivilDateTime;
  end?: CivilDateTime;
}

export interface DailyRollupDataPoint {
  civilStartTime?: CivilDateTime;
  civilEndTime?: CivilDateTime;
  steps?: { countSum?: string };
  heartRate?: {
    beatsPerMinuteAvg?: number;
    beatsPerMinuteMin?: number;
    beatsPerMinuteMax?: number;
  };
  restingHeartRatePersonalRange?: {
    beatsPerMinuteMin?: number;
    beatsPerMinuteMax?: number;
  };
  heartRateVariabilityPersonalRange?: {
    averageHeartRateVariabilityMillisecondsMin?: number;
    averageHeartRateVariabilityMillisecondsMax?: number;
  };
  activeMinutes?: {
    activeMinutesRollupByActivityLevel?: Array<{
      activeMinutesSum?: string;
    }>;
  };
  distance?: { millimetersSum?: string };
  totalCalories?: { kcalSum?: number };
  weight?: { weightGramsAvg?: number };
  runVo2Max?: { rateAvg?: number; rateMin?: number; rateMax?: number };
}

export interface HealthDataPoint {
  name?: string;
  sleep?: {
    interval?: {
      civilEndTime?: CivilDateTime;
      civilStartTime?: CivilDateTime;
      startTime?: string;
      endTime?: string;
    };
    summary?: {
      minutesAsleep?: string;
      minutesAwake?: string;
      minutesInSleepPeriod?: string;
      minutesAfterWakeUp?: string;
      minutesToFallAsleep?: string;
      totalMinutesAsleep?: number | string;
      totalTimeInBed?: number | string;
      stagesSummary?: Array<{ type?: string; minutes?: string | number; count?: string }>;
      /** Aggregated stage minutes (newer API shape). */
      stages?: {
        deep?: number;
        light?: number;
        rem?: number;
        wake?: number;
        awake?: number;
      };
    };
    stages?: Array<{
      type?: string;
      startTime?: string;
      endTime?: string;
    }>;
    metadata?: { nap?: boolean; processed?: boolean };
  };
  exercise?: {
    interval?: { civilStartTime?: CivilDateTime };
    exerciseType?: string;
    displayName?: string;
    activeDuration?: string;
    metricsSummary?: {
      caloriesKcal?: number;
      distanceMillimeters?: number;
      averageHeartRateBeatsPerMinute?: string;
    };
  };
  dailyOxygenSaturation?: {
    date?: CivilDate;
    averagePercentage?: number;
  };
  dailyRestingHeartRate?: {
    date?: CivilDate;
    beatsPerMinute?: string | number;
  };
  dailyHeartRateVariability?: {
    date?: CivilDate;
    averageHeartRateVariabilityMilliseconds?: number;
    deepSleepRootMeanSquareOfSuccessiveDifferencesMilliseconds?: number;
    entropy?: number;
    nonRemHeartRateBeatsPerMinute?: string;
  };
}
