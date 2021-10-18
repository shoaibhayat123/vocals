export enum genreTypes {
Ambient= "ambient",
Children= "children",
Cinematic= "cinematic",
Classical= "classical",
Electronic= "electronic",
Fantasy= "fanstasy",
HipHop= "hiphop",
Holiday= "holiday",
Indie= "indie",
Jazz= "jazz",
Pop= "pop",
Retro= "retro",
SoulAndRnB= "soulAndRnB",
World= "world",   
};
export const genreValues = Object.keys(genreTypes).map((k: any) => genreTypes[k]);
