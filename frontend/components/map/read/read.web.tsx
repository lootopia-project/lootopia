import { useEffect, useState } from "react";
import MapScreen from "../index/map.web";
import { getSpot } from "@/services/MapService";
import MapParams from "@/type/feature/map/params";
import type { MapReadProps } from "@/type/feature/map/MapReadProps";

export default function MapRead({ mapId }: MapReadProps) {
    const [params,setParams] = useState<MapParams>({
        status:false,
        center: [0,0],
        markers: [],
        square: {
            topLeft: [0,0],
            topRight: [0,0],
            bottomRight: [0,0],
            bottomLeft: [0,0]
        },
        zoom: 13
    });
  useEffect(() => {
    const fetchgetSpot = async () => {
      try {
        const Spots = await getSpot(mapId)
        setParams(Spots)        
      } catch (err) {
        console.warn('Erreur lors de la récupération des spots :', err)
      }
    }
    fetchgetSpot()
  }, [mapId])
  return (
    params.status &&
    <MapScreen status={params.status} center={params.center} markers={params.markers} square={params.square} zoom={params.zoom} />
  )
}