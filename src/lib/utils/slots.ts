import { addMinutes, setHours, setMinutes, isBefore, isAfter, format } from 'date-fns';
import { WorkingHours } from '@/types/business';

export interface TimeSlot {
  start: Date;
  end: Date;
  available: boolean;
}

export interface AvailabilityFilters {
  professionalId?: string;
  serviceId?: string;
  locationId?: string;
  existingBookings?: Array<{ start: Date; end: Date }>;
  blocks?: Array<{ start: Date; end: Date; reason?: string }>;
}

/**
 * Calculate available time slots for a given date
 */
export function calculateAvailableSlots(
  date: Date,
  workingHours: WorkingHours,
  durationMinutes: number,
  bufferMinutes: number = 0,
  filters?: AvailabilityFilters
): TimeSlot[] {
  const dayOfWeek = format(date, 'EEEE').toLowerCase() as keyof WorkingHours;
  const daySchedule = workingHours[dayOfWeek];

  if (!daySchedule || daySchedule.closed) {
    return [];
  }

  const slots: TimeSlot[] = [];
  const [openHour, openMinute] = daySchedule.open.split(':').map(Number);
  const [closeHour, closeMinute] = daySchedule.close.split(':').map(Number);

  const dayStart = setMinutes(setHours(date, openHour), openMinute);
  const dayEnd = setMinutes(setHours(date, closeHour), closeMinute);

  // Get blocked times
  const blockedTimes: Array<{ start: Date; end: Date }> = [
    ...(filters?.existingBookings || []),
    ...(filters?.blocks || []),
  ];

  // Generate slots
  let currentTime = dayStart;
  const slotInterval = durationMinutes + bufferMinutes;

  while (currentTime < dayEnd) {
    const slotEnd = addMinutes(currentTime, durationMinutes);
    
    // Check if slot fits within working hours
    if (slotEnd <= dayEnd) {
      // Check if slot conflicts with existing bookings or blocks
      const isBlocked = blockedTimes.some((block) => {
        return (
          (currentTime >= block.start && currentTime < block.end) ||
          (slotEnd > block.start && slotEnd <= block.end) ||
          (currentTime <= block.start && slotEnd >= block.end)
        );
      });

      // Check if slot is in the past
      const isPast = isBefore(currentTime, new Date());

      slots.push({
        start: new Date(currentTime),
        end: slotEnd,
        available: !isBlocked && !isPast,
      });
    }

    currentTime = addMinutes(currentTime, slotInterval);
  }

  return slots;
}

/**
 * Format time slot for display
 */
export function formatTimeSlot(slot: TimeSlot): string {
  return format(slot.start, 'HH:mm');
}

/**
 * Check if a specific time slot is available
 */
export function isSlotAvailable(
  startTime: Date,
  durationMinutes: number,
  workingHours: WorkingHours,
  existingBookings: Array<{ start: Date; end: Date }> = [],
  blocks: Array<{ start: Date; end: Date }> = []
): boolean {
  const dayOfWeek = format(startTime, 'EEEE').toLowerCase() as keyof WorkingHours;
  const daySchedule = workingHours[dayOfWeek];

  if (!daySchedule || daySchedule.closed) {
    return false;
  }

  const [openHour, openMinute] = daySchedule.open.split(':').map(Number);
  const [closeHour, closeMinute] = daySchedule.close.split(':').map(Number);

  const dayStart = setMinutes(setHours(startTime, openHour), openMinute);
  const dayEnd = setMinutes(setHours(startTime, closeHour), closeMinute);

  const slotEnd = addMinutes(startTime, durationMinutes);

  // Check if within working hours
  if (isBefore(startTime, dayStart) || isAfter(slotEnd, dayEnd)) {
    return false;
  }

  // Check if in the past
  if (isBefore(startTime, new Date())) {
    return false;
  }

  // Check conflicts
  const allBlocks = [...existingBookings, ...blocks];
  const hasConflict = allBlocks.some((block) => {
    return (
      (startTime >= block.start && startTime < block.end) ||
      (slotEnd > block.start && slotEnd <= block.end) ||
      (startTime <= block.start && slotEnd >= block.end)
    );
  });

  return !hasConflict;
}
