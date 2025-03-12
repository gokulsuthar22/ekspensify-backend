export interface SendNotificationData {
  userId: number[];
  heading: string;
  content: string;
  imageUrl?: string;
  data?: {
    activity?: string;
    id?: number;
  };
}
