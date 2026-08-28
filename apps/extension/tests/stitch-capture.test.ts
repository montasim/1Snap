import { describe, expect, it } from 'vitest';
import { calculateOutputGeometry } from '../src/application/stitch-capture';

describe('calculateOutputGeometry', () => {
  it('keeps ordinary captures at device-pixel resolution', () => {
    expect(calculateOutputGeometry(2_880, 1_800, 1_440, 900, 4_500)).toEqual({
      width: 2_880,
      height: 9_000,
      sourceScale: 2,
      downscale: 1,
    });
  });

  it('scales very long captures into Chrome canvas limits', () => {
    const output = calculateOutputGeometry(2_880, 1_800, 1_440, 900, 50_000);
    expect(output.height).toBeLessThanOrEqual(32_000);
    expect(output.downscale).toBeLessThan(1);
  });
});
