import { Shift } from '@/types/timeClock';

/**
 * Calculate total hours for a shift
 */
export function calculateShiftHours(shift: Shift): number {
  if (!shift.endTime) {
    // Active shift - calculate from start to now
    const start = new Date(shift.startTime as Date).getTime();
    const now = Date.now();
    const hours = (now - start) / (1000 * 60 * 60);
    return Math.max(0, hours - (shift.breakDuration || 0) / 60);
  }

  const start = new Date(shift.startTime as Date).getTime();
  const end = new Date(shift.endTime as Date).getTime();
  const totalMinutes = (end - start) / (1000 * 60);
  const breakMinutes = shift.breakDuration || 0;
  const workMinutes = totalMinutes - breakMinutes;

  return workMinutes / 60;
}

/**
 * Calculate overtime hours
 * Brazilian law: > 8 hours/day or > 44 hours/week
 */
export function calculateOvertime(
  shift: Shift,
  weeklyHours: number = 0
): number {
  const shiftHours = calculateShiftHours(shift);
  const dailyOvertime = Math.max(0, shiftHours - 8);
  const weeklyOvertime = weeklyHours > 44 ? Math.max(0, weeklyHours - 44) : 0;

  return Math.max(dailyOvertime, weeklyOvertime / 5); // Average daily overtime
}

/**
 * Calculate time bank balance
 */
export function calculateTimeBank(
  shifts: Shift[],
  targetHoursPerDay: number = 8
): number {
  const totalHours = shifts.reduce((sum, shift) => {
    return sum + calculateShiftHours(shift);
  }, 0);

  const expectedHours = shifts.length * targetHoursPerDay;
  return totalHours - expectedHours; // Positive = credit, Negative = debit
}
