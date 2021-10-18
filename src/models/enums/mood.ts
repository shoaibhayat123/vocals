export enum moodTypes {
Uplifting= "uplifting",
Epic= "epic",
Powerful= "powerful",
Exciting= "exciting",
Emotional= "emotional",
Inspiring= "inspiring",
Happy= "happy",
Funny= "funny",
Carefree= "carefree",
Love= "love",
Playful= "playful",
Groovy= "groovy",
Hopeful= "hopeful",
Peaceful= "peaceful",
Serious= "serious",
Dramatic= "dramatic",
Angry= "angry",
Tense= "tense",
Sad= "sad",
Dark= "dark",
Whimsical= "whimsical"    
};
export const moodValues = Object.keys(moodTypes).map((k: any) => moodTypes[k]);
