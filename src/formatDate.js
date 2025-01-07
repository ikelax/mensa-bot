import { format } from "date-fns";
import { de } from "date-fns/locale";

export { formatDate };

/**
 * Formats the date like "Freitag, 27.12.2024".
 *
 * @param {string} timestamp the timestamp of the date
 * @returns {string} the formatted date
 */
function formatDate(timestamp) {
  const dateFnsOptions = { locale: de };
  const weekday = format(timestamp, "EEEE", dateFnsOptions);
  const date = format(timestamp, "P", dateFnsOptions);

  return `${weekday}, ${date}`;
}
