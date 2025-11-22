export enum StringName {
  E2 = 'E2',
  A2 = 'A2',
  D3 = 'D3',
  G3 = 'G3',
  B3 = 'B3',
  E4 = 'E4',
  AUTO = 'Auto'
}

export interface GuitarString {
  name: StringName;
  frequency: number; // Hz
  display: string; // Base display name (e.g., "E")
}

export interface TuningResult {
  note: string;
  frequency: number;
  cents: number; // Difference from perfect pitch in cents
  isTuned: boolean; // Within tolerance
}

export const GUITAR_STRINGS: GuitarString[] = [
  { name: StringName.E2, frequency: 82.41, display: 'E' },
  { name: StringName.A2, frequency: 110.00, display: 'A' },
  { name: StringName.D3, frequency: 146.83, display: 'D' },
  { name: StringName.G3, frequency: 196.00, display: 'G' },
  { name: StringName.B3, frequency: 246.94, display: 'B' },
  { name: StringName.E4, frequency: 329.63, display: 'E' },
];
