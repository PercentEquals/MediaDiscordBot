// src/lib/performance/performance.test.ts
import { describe, expect, mock, test } from 'bun:test';
import performance from './performance';

describe('performance', () => {
   test('should return result of the function', async () => {
    const context = {};
    const fn = mock(async () => 'result');

    const result = await performance(context, fn);
    expect(result).toBe('result');
  });

  test('should handle errors', async () => {
    const context = {};
    const fn = mock(async () => {
      throw new Error('Test error');
    });

    await expect(performance(context, fn)).rejects.toThrowError(
      'Test error',
    );
  });
});