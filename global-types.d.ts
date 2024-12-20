declare global {
  interface HelpingHandsLocationCreate {
    name: string;
    latitude: number | null;
    longitude: number | null;
    address: string | null;
    tagIds: string[] | string;
  }

  interface Coordinates {
    latitude: number | null;
    longitude: number | null;
  }

  interface HelpingHandsLocation {
    creatorId: any;
    id: number;
    name: string;
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
