export const formatTime = (date) => {
  if (!date) return ""; 

  const now = new Date();
  const msgDate = new Date(date);

  const diffDays = Math.floor(
    (now - msgDate) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) {
    return msgDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (diffDays === 1) return "Yesterday";

  return msgDate.toLocaleDateString();
};