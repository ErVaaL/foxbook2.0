export const formatDate = (dateString: string): string => {
  if (!dateString) return "Unknown date";

  const date = new Date(dateString);

  if (isNaN(date.getTime())) return "Invalid date";

  return date.toLocaleDateString("en-UK", {
    hour: "numeric",
    minute: "numeric",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
