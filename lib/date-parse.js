exports = module.exports = function parseDate(d) {
  if (typeof d === 'undefined') {
    // for compatibility with moment()
    return new Date();
  }

  if (d === null) {
    throw new TypeError(`Null date input`);
  }

  if (d instanceof Date) {
    return new Date(d.getTime()); // copy
  }

  if (typeof d === 'number') {
    const date = new Date(d);
    if (!date) {
        throw new TypeError(`Invalid date input: ${d}`);
    }
    return date;
  }

  if (typeof d === 'string') {
    const parsed = Date.parse(d);
    if (isNaN(parsed)) {
      throw new TypeError(`Invalid date input (string): ${d}`);
    }
    return new Date(parsed);
  }

  throw new TypeError(`Unsupported date input: ${typeof d}`);
}