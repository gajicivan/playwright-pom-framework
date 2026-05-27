let counter = 0;

export function uniqueSuffix(): string {
  counter += 1;
  return `${Date.now().toString(36)}${counter}`.toLowerCase();
}
