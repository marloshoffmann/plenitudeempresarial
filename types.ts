
export type DISC_FACTOR = 'D' | 'I' | 'S' | 'C';

export interface Adjective {
  text: string;
  factor: DISC_FACTOR;
  description: string;
}

export interface AdjectiveGroup {
  adjectives: Adjective[];
}

export type VALUE_FACTOR = 'P' | 'E' | 'R' | 'S' | 'B' | 'T';

export interface ValuePhrase {
  text: string;
  factor: VALUE_FACTOR;
}

export interface ValueGroup {
  phrases: ValuePhrase[];
}

export interface AssessmentResult {
  disc: Record<DISC_FACTOR, number>;
  values: Record<VALUE_FACTOR, number>;
}
