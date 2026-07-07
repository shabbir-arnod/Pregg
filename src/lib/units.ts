import type { WeightUnit } from '../types';

const KG_PER_LB = 0.45359237;

export function kgToLb(kg: number): number {
  return kg / KG_PER_LB;
}

export function lbToKg(lb: number): number {
  return lb * KG_PER_LB;
}

// Weight readings are always stored in kg; convert for display/input in
// whichever unit is currently selected.
export function fromKg(kg: number, unit: WeightUnit): number {
  return unit === 'lb' ? kgToLb(kg) : kg;
}

export function toKg(value: number, unit: WeightUnit): number {
  return unit === 'lb' ? lbToKg(value) : value;
}

export function roundWeight(value: number): number {
  return Math.round(value * 10) / 10;
}
