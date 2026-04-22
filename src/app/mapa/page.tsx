import MapExplorer from "@/components/MapExplorer";
import { getPlaces, getProperties } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function MapaPage() {
  const [places, properties] = await Promise.all([getPlaces(), getProperties()]);
  return <MapExplorer places={places} properties={properties} initialCategory="all" />;
}
