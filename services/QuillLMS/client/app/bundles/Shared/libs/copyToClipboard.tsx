export function copyToClipboard(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, setterFunction) {
  navigator.clipboard && navigator.clipboard.writeText(e.currentTarget.value)
  setterFunction(true);
  setTimeout(() => setterFunction(false), 3000);
};
