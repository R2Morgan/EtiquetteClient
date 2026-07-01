export interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  type: number;
  createdAt: string;
  authorName: string;
  authorPicture: string | null;
  eventId: string | null;
}
