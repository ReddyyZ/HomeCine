export type Movie = {
  id: number;
  year?: number;
  overview?: string;
  posterUrl?: string;
  title: string;
  filePath: string;
  isSeries: boolean;
  numberOfSeasons?: number;
  createdAt: string;
  updatedAt: string;
};
