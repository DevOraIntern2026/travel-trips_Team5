/**
 * Shared class-transformer functions for DTOs. Each takes the raw incoming
 * value and returns the normalized one; validation decorators run after.
 */

interface TransformParams {
  value: unknown;
}

/** Trim strings; pass everything else through untouched. */
export function trimString({ value }: TransformParams): unknown {
  return typeof value === 'string' ? value.trim() : value;
}

/**
 * Coerce to a number, preserving null/undefined (and treating '' as
 * undefined) so @IsOptional() still skips absent values.
 */
export function toNumberOrNull({ value }: TransformParams): unknown {
  if (value === null || value === undefined || value === '') {
    return value === '' ? undefined : value;
  }
  return Number(value);
}

/**
 * Coerce 'true'/'false' strings to booleans, preserving undefined so
 * @IsOptional() still skips absent values.
 */
export function toBoolean({ value }: TransformParams): unknown {
  if (value === true || value === 'true') return true;
  if (value === false || value === 'false') return false;
  return value;
}
