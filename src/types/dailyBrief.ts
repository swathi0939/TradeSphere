export interface DailyBriefHighlight {
  label: string;
  value: string;
  tone?: 'positive' | 'negative' | 'neutral';
}

export interface DailyBrief {
  greeting: string;
  date: string; // ISO date (yyyy-mm-dd) of the brief
  summary: string; // the narrative paragraph
  highlights: DailyBriefHighlight[];
}
