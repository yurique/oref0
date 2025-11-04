exports = module.exports = function parseDate(d) {
  if (d == null) return null;

  // if it's already a Date
  if (d instanceof Date) {
    return new Date(d.getTime()); // copy
  }

  // if it's a number -> milliseconds since epoch
  if (typeof d === 'number') {
    return new Date(d);
  }

  // if it's a string -> parse
  if (typeof d === 'string') {
    const parsed = Date.parse(d);
    if (isNaN(parsed)) {
      throw new TypeError(`Invalid date input: ${d}`);
    }
    return new Date(parsed);
  }

  // unsupported type
  throw new TypeError(`Unsupported date input: ${typeof d}`);
}