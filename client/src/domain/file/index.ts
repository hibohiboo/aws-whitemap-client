export const getExtension = (filename: string) => {
  const result = /\.(.*)$/.exec(filename);
  if (result) {
    const [, ext] = result;
    return ext;
  }
  throw new Error('拡張子がありません');
};
