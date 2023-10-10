const { format } = require("date-fns");

const getCurrentFormattedDate = () => {
  const now = new Date();
  const dateFormatted = format(now, "dd.MM.yyyy - HH.mm.ss");
  return dateFormatted.toString();
};

module.exports = getCurrentFormattedDate;
