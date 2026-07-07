import { create } from "zustand";

type TutorialStatus = "active" | "done";

type TutorialState = {
  status: TutorialStatus;
  completeFinalStep: () => void;
};

export const useTutorialStore = create<TutorialState>((set) => ({
  status: "active",
  completeFinalStep: () => set({ status: "done" }),
}));
