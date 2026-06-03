export type GoogleHealthDataType =
  | "steps"
  | "heart-rate"
  | "resting-heart-rate"
  | "heart-rate-variability"
  | "oxygen-saturation"
  | "sleep"
  | "exercise"
  | "weight"
  | "vo2-max"
  | "nutrition"
  | "ecg"
  | "irregular-rhythm-notifications";

export interface GoogleHealthDataPoint {
  dataType: GoogleHealthDataType;
  startTime: string;
  endTime: string;
  value: number | string | Record<string, unknown>;
  unit?: string;
}

export interface GoogleHealthDailyRollup {
  date: string;
  dataType: GoogleHealthDataType;
  aggregate: Record<string, number>;
}

export interface RawHealthPayload {
  dataPoints?: GoogleHealthDataPoint[];
  sessions?: Record<string, unknown>[];
  source?: string;
}
