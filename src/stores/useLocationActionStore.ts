import { create } from "zustand";

interface LocationActionStore {
  addLocation: boolean;
  toggleAddLocation: () => void;
}

const useLocationActionStore = create<LocationActionStore>((set) => {
  return {
    addLocation: false,
    toggleAddLocation: () => {
      set((state) => ({ addLocation: !state.addLocation }));
    },
  };
});

export default useLocationActionStore;
