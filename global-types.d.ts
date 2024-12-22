declare global {
  interface HelpingHandsLocationForm {
    name: string | null;
    latitude: number | null;
    longitude: number | null;
    address: string | null;
    tagIds: number[] | number;
  }

  interface Coordinates {
    latitude: number | null;
    longitude: number | null;
  }

  interface HelpingHandsLocation {
    creatorId: number | null;
    id: number | null;
    name: string | null;
    latitude: number | null;
    longitude: number | null;
    address: string | null;
    tags: Tag[];
  }

  interface Tag {
    id: number;
    name: string;
  }
}

export {};
