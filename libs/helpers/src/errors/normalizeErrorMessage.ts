import { CustomError } from './handleError';

export const normalizeErrorMessage = (error: CustomError) => {
  const { message, status, tag } = error;
  message.trim();
  if (message.includes('') && tag === 'PG QUERY') return '';
  if (status === 400) return 'לא נשלח מידע מתאים לשרת';
  if (tag === 'AUTH') return ' שגיאת אוטוריזציה / אוטנטיקציה';
  return 'שגיאה בשרת';
};
