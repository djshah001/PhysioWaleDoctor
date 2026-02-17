import api from "./api";
import { Review } from "../types/models";

interface CreateReviewPayload {
  clinicId: string;
  rating: number;
  message?: string;
  appointmentId?: string; // Optional
}

export const reviewApi = {
  getClinicReviews: (clinicId: string) =>
    api.get<Review[]>(`/reviews/clinic/${clinicId}`),
  create: (data: CreateReviewPayload) => api.post<Review>("/reviews", data),
};
