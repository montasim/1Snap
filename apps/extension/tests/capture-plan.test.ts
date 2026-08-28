import { describe, expect, it } from 'vitest';
import {
  chooseRulerInterval,
  formatBytes,
  makeCaptureFilename,
  planCapturePositions,
} from '../src/application/capture-plan';

describe('planCapturePositions', () => {
  it('captures a viewport-sized page once', () => {
    expect(planCapturePositions(900, 900)).toEqual([0]);
  });

  it('ends at the exact final scroll offset without leaving a gap', () => {
    expect(planCapturePositions(2_500, 900)).toEqual([0, 900, 1_600]);
  });

  it('rejects captures that exceed the frame safety limit', () => {
    expect(() => planCapturePositions(20_000, 500, 10)).toThrow('more than 10 capture frames');
  });
});

describe('capture presentation helpers', () => {
  it('creates filesystem-safe PNG names', () => {
    expect(makeCaptureFilename('A page: Résumé / 2026', new Date('2026-08-28T12:30:00Z'))).toBe(
      '1snap-a-page-resume-2026-2026-08-28T12-30-00-000Z.png',
    );
  });

  it('adapts ruler density to long pages', () => {
    expect(chooseRulerInterval(4_000)).toBe(500);
    expect(chooseRulerInterval(9_000)).toBe(1_000);
    expect(chooseRulerInterval(40_000)).toBe(5_000);
  });

  it('formats PNG sizes for the proof rail', () => {
    expect(formatBytes(12_582_912)).toBe('12.0 MB');
  });
});
