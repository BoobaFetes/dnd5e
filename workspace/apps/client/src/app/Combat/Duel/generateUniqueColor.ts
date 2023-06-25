export function generateUniqueColor(str: string) {
  if (!str) {
    return undefined;
  }
  const hash = md5(str);
  const colorHex = hash.slice(0, 6).replace(/-/, '0');
  const colorHTML = `#${colorHex}`;
  return colorHTML;
}

function md5(str: string) {
  let hash = 0;

  if (str.length === 0) {
    return hash.toString(16);
  }

  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    hash = (hash << 5) - hash + charCode;
    hash = hash & hash; // Convertit en un entier 32 bits
  }

  return hash.toString(16);
}
