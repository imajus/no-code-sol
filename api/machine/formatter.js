export function format(text, state) {
  for (const [name, value] of Object.entries(state)) {
    // eslint-disable-next-line no-param-reassign
    text = text.replace(`{${name}}`, value);
  }
  return text;
}
