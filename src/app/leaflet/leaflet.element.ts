import { LatLngLiteral, LatLngExpression, Map, Marker, Polygon } from 'leaflet';
import { Commune } from '../utility';

declare const L: any;

export class LeafletElement extends HTMLElement {
  private shadow: ShadowRoot;
  private map: Map;
  private markers: Marker[] = [];
  private polygons: Polygon[] = [];
  constructor() {
    super();

    this.map = L.map(this);
    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
      attribution:
        'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
      minZoom: 1,
      maxZoom: 20
    }).addTo(this.map);
  }

  public convertToPolygon(coordinates: number[][]) {
    return coordinates.map(value => ({
      lat: value[1],
      lng: value[0]
    }));
  }

  public getPolygon(commune: Commune) {
    if (commune.contour.type === 'Polygon') {
      return [
        this.convertToPolygon(commune.contour.coordinates[0] as number[][])
      ];
    } else {
      return (commune.contour.coordinates[0] as number[][][]).map(value =>
        this.convertToPolygon(value)
      );
    }
  }

  public selectTown(commune: Commune) {
    this.add([
      {
        center: {
          lat: commune.centre.coordinates[1],
          lng: commune.centre.coordinates[0]
        },
        polygon: this.getPolygon(commune)
      }
    ]);
  }

  public add(
    areas: { center: LatLngLiteral; polygon: LatLngExpression[][] }[]
  ): void {
    this.clear();
    areas.forEach(area => {
      this.markers.push(this.addMarker(area.center));
      area.polygon.forEach(polygon =>
        this.polygons.push(this.addPolygon(polygon))
      );
    });
  }

  public clear(): void {
    this.markers.forEach(marker => {
      this.map.removeLayer(marker);
    });
    this.markers = [];
    this.polygons.forEach(polygon => {
      this.map.removeLayer(polygon);
    });
    this.polygons = [];
  }

  public addMarker(center: LatLngLiteral): Marker {
    return L.marker([center.lat, center.lng]).addTo(this.map);
  }

  private addPolygon(latlngs: LatLngExpression[]): Polygon {
    const polygon = L.polygon(latlngs, { color: 'blue' }).addTo(this.map);
    this.map.fitBounds(polygon.getBounds());
    return polygon;
  }
}
