import MapExplorer from "@/components/MapExplorer";
import { getPlaces } from "@/lib/data";
export const dynamic = "force-dynamic";
export default async function Page() {
  const places = await getPlaces();
  return <MapExplorer places={places} initialCategory="turismo" />;
}
