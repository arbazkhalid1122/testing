export const generatePreviewImageName = (file: File) => {
  const randomName = Array(32)
  .fill(null)
  .map(() => Math.round(Math.random() * 16).toString(16))
  .join('');

  return `${randomName}-${file.name}`;
}

export const isAndroidDevice = (): boolean => {
  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.includes('android');
}
