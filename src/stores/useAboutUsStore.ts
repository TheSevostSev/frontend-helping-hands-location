import { create } from "zustand";

interface AboutUsStore {
  aboutUsShow: boolean;
  toggleAboutUsShow: () => void;
}

const useAboutUsStore = create<AboutUsStore>((set) => {
  return {
    aboutUsShow: false,
    toggleAboutUsShow: () => {
      set((state) => ({ aboutUsShow: !state.aboutUsShow }));
    },
  };
});

export default useAboutUsStore;
