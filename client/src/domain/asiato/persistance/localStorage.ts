import { Asiato } from '../types';

export const insertQueue = (asiatoList: Asiato[], asiato: Asiato) => {
  if (asiatoList.length < 30) {
    return [asiato, ...asiatoList];
  }
  const tmp = [...asiatoList];
  tmp.pop();
  return [asiato, ...tmp];
};

const ASIATO_KEY = 'asiato';

export const updateAsiato = async (asiatoList: Asiato[]) => {
  localStorage.setItem(ASIATO_KEY, JSON.stringify(asiatoList));
};

export const getAsiatoList = () => {
  const json = localStorage.getItem(ASIATO_KEY);
  if (json) return JSON.parse(json);
  return [];
};
