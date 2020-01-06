// From https://stackoverflow.com/a/36046727
export const ToBase64 = (u8: any) => {
  return btoa(String.fromCharCode.apply(null, u8));
};

export const FromBase64 = (str: string) => {
  return atob(str)
    .split('')
    .map(c => c.charCodeAt(0));
};

export const updateHashState = (ntiles: number, texWidth: any, map: any) => {
  let c = 0;
  const u8 = new Uint8Array(ntiles * ntiles);
  for (let i = 0; i < ntiles; i++) {
    for (let j = 0; j < ntiles; j++) {
      u8[c++] = map[i][j][0] * texWidth + map[i][j][1];
    }
  }
  const state = ToBase64(u8);
  //@ts-ignore
  history.replaceState(undefined, undefined, `#${state}`); //eslint-disable-line
};

export const loadHashState = (
  state: string,
  ntiles: any,
  texWidth: any,
  map: any,
) => {
  const u8 = FromBase64(state);
  let c = 0;
  for (let i = 0; i < ntiles; i++) {
    for (let j = 0; j < ntiles; j++) {
      const t = u8[c++] || 0;
      const x = Math.trunc(t / texWidth);
      const y = Math.trunc(t % texWidth);
      map[i][j] = [x, y];
    }
  }
};
