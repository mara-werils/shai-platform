export const formatDate = (dateString: string, includeTime: boolean = false) => {
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  };

  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }

  return new Date(dateString).toLocaleDateString('en-GB', options);
}; 