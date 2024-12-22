import { create } from "zustand";

interface LocationPopupStore {
  showPopup: boolean;
  toggleShowPopup: () => void;
  location: HelpingHandsLocation;
  resetLocation: () => void;
  setLocation: (location: HelpingHandsLocation) => void;
}

const useLocationPopupStore = create<LocationPopupStore>((set) => {
  return {
    location: {
      id: null,
      name: null,
      address: null,
      latitude: null,
      longitude: null,
      tags: [],
      creatorId: null,
    },
    showPopup: false,
    toggleShowPopup: () => {
      set((state) => ({ showPopup: !state.showPopup }));
    },
    resetLocation: () => {
      set(() => ({
        location: {
          id: null,
          name: null,
          address: null,
          latitude: null,
          longitude: null,
          tags: [],
          creatorId: null,
        },
      }));
    },
    setLocation: (location: HelpingHandsLocation) => {
      set({ location });
    },
  };
});

export default useLocationPopupStore;
