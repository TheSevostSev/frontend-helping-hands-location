import "leaflet";
import "leaflet-control-geocoder";

declare module "leaflet" {
  namespace Control {
    interface GeocoderResult {
      center: L.LatLng;
      name: string;
      bounds: L.LatLngBounds;
      [key: string]: unknown;
    }

    interface Geocoder {
      geocode(
        query: string,
        callback: (results: GeocoderResult[]) => void
      ): void;
    }

    interface GeocoderConstructor {
      new (): Geocoder;
      nominatim(): Geocoder;
    }
    const Geocoder: GeocoderConstructor;
  }

  export const Control: {
    Geocoder: Control.GeocoderConstructor;
  };
}
