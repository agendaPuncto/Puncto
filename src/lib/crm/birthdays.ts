import { Customer } from '@/types/booking';

/**
 * Check if customer has birthday today
 */
export function hasBirthdayToday(customer: Customer): boolean {
  if (!customer.customFields?.birthday) {
    return false;
  }

  const birthday = new Date(customer.customFields.birthday);
  const today = new Date();

  return (
    birthday.getMonth() === today.getMonth() &&
    birthday.getDate() === today.getDate()
  );
}

/**
 * Get customers with birthdays in the next N days
 */
export function getUpcomingBirthdays(
  customers: Customer[],
  days: number = 7
): Customer[] {
  const today = new Date();
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + days);

  return customers.filter((customer) => {
    if (!customer.customFields?.birthday) {
      return false;
    }

    const birthday = new Date(customer.customFields.birthday);
    const thisYearBirthday = new Date(
      today.getFullYear(),
      birthday.getMonth(),
      birthday.getDate()
    );

    if (thisYearBirthday < today) {
      // Birthday already passed this year, check next year
      thisYearBirthday.setFullYear(today.getFullYear() + 1);
    }

    return thisYearBirthday >= today && thisYearBirthday <= targetDate;
  });
}
