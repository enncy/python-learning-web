import colorLib from "@kurkle/color";

export const COLORS = [
  "#4dc9f6",
  "#f67019",
  "#f53794",
  "#537bc4",
  "#acc236",
  "#166a8f",
  "#00a950",
  "#58595b",
  "#8549ba",
];

export function transparentize(value: string, opacity: number) {
  var alpha = opacity === undefined ? 0.6 : 1 - opacity;
  return colorLib(value).alpha(alpha).rgbString();
}

export function getBackgroundColors(num: number) {
  const colors: string[] = [];
  for (let index = 0; index < num; index++) {
    colors.push(transparentize(COLORS[index], 0.6));
  }
  return colors;
}
