import api from "./api";

export interface SelfTestCategory {
  _id: string;
  name: string;
  image?: string;
}

export interface SelfTestQuestion {
  _id: string;
  question: string;
  options: string[];
  correctOption: number; // or string value
}

export const selfTestApi = {
  getCategories: () => api.get<SelfTestCategory[]>("/self-test/categories"),
  getQuestions: (categoryId?: string) =>
    api.get<SelfTestQuestion[]>("/self-test/questions", {
      params: { categoryId },
    }),
};
