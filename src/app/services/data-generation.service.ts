import { Injectable } from '@angular/core';
import { DataDistribution } from '../models/sort-models';

@Injectable({ providedIn: 'root' })
export class DataGenerationService {

  generate(length: number, distribution: DataDistribution, customInput?: string): number[] {
    switch (distribution) {
      case 'random':
        return this.generateRandom(length);
      case 'nearly-sorted':
        return this.generateNearlySorted(length);
      case 'reversed':
        return this.generateReversed(length);
      case 'duplicates':
        return this.generateDuplicates(length);
      case 'custom':
        if (!customInput) return [];
        const parsed = this.parseCustomInput(customInput);
        return parsed ?? [];
      default:
        return [];
    }
  }

  parseCustomInput(input: string): number[] | null {
    if (!input || input.trim().length === 0) return null;
    const parts = input.split(',').map(s => s.trim());
    if (parts.some(p => p.length === 0)) return null;
    const numbers: number[] = [];
    for (const part of parts) {
      const num = Number(part);
      if (!Number.isFinite(num)) return null;
      numbers.push(num);
    }
    if (numbers.length === 0) return null;
    return numbers;
  }

  generateForStability(length: number): { values: number[]; tags: Map<number, string[]> } {
    const tagPalette = [
      '#FF4444', '#4444FF', '#44FF44', '#FF44FF', '#44FFFF',
      '#FFAA44', '#AA44FF', '#44FFAA', '#FF4488', '#88FF44'
    ];
    const uniqueCount = Math.ceil(length * 0.7);
    const duplicateCount = length - uniqueCount;
    const numDuplicateValues = Math.max(3, Math.min(4, Math.floor(duplicateCount / 2)));
    const allValues: number[] = [];
    for (let i = 1; i <= uniqueCount; i++) {
      allValues.push(i);
    }
    const duplicateSourceValues = allValues.slice(0, numDuplicateValues);
    for (let i = 0; i < duplicateCount; i++) {
      const sourceVal = duplicateSourceValues[i % numDuplicateValues];
      allValues.push(sourceVal);
    }
    for (let i = allValues.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allValues[i], allValues[j]] = [allValues[j], allValues[i]];
    }
    const tags = new Map<number, string[]>();
    const occurrenceIndex = new Map<number, number>();
    for (const val of allValues) {
      const idx = occurrenceIndex.get(val) ?? 0;
      occurrenceIndex.set(val, idx + 1);
      if (!tags.has(val)) {
        tags.set(val, []);
      }
      tags.get(val)!.push(tagPalette[idx % tagPalette.length]);
    }
    return { values: allValues, tags };
  }

  private generateRandom(length: number): number[] {
    const max = length * 2;
    return Array.from({ length }, () => Math.floor(Math.random() * max) + 1);
  }

  private generateNearlySorted(length: number): number[] {
    const arr = Array.from({ length }, (_, i) => i + 1);
    const swapCount = Math.max(1, Math.floor(length * 0.1));
    for (let i = 0; i < swapCount; i++) {
      const idx = Math.floor(Math.random() * length);
      const offset = Math.floor(Math.random() * 7) - 3;
      const neighborIdx = Math.min(Math.max(idx + offset, 0), length - 1);
      [arr[idx], arr[neighborIdx]] = [arr[neighborIdx], arr[idx]];
    }
    return arr;
  }

  private generateReversed(length: number): number[] {
    return Array.from({ length }, (_, i) => length - i);
  }

  private generateDuplicates(length: number): number[] {
    const maxVal = length * 2;
    const distinctValues = [
      Math.round(maxVal * 0.1),
      Math.round(maxVal * 0.3),
      Math.round(maxVal * 0.5),
      Math.round(maxVal * 0.7),
      Math.round(maxVal * 0.9)
    ];
    return Array.from({ length }, () => distinctValues[Math.floor(Math.random() * distinctValues.length)]);
  }
}
