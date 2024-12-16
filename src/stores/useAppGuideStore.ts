import { create } from "zustand";

interface AppGuideStore {
  appGuideShow: boolean;
  toggleAppGuideShow: () => void;
}

const useAppGuideStore = create<AppGuideStore>((set) => {
  return {
    appGuideShow: false,
    toggleAppGuideShow: () => {
      set((state) => ({ appGuideShow: !state.appGuideShow }));
    },
  };
});

export default useAppGuideStore;
