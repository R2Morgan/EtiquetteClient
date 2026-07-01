export interface EtiquetteEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  type: number;
  totalSpots: number;
  bookedSpots: number;
  bookedByMe: boolean;
}
