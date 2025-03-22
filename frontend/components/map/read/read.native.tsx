import MapScreen from "../index/map.native";
import { useEffect, useState } from "react";
import { getSpot } from "@/services/MapService";
import MapParams from "@/type/feature/map/params";

export default function MapRead() {
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
        const Spots = await getSpot(1)
        setParams(Spots)        
      } catch (err) {
        console.warn('Erreur lors de la récupération des chasses publiques :', err)
      }
    }
    fetchgetSpot()
  }, [])
  return (
    params.status &&
    <MapScreen status={params.status} center={params.center} markers={params.markers} square={params.square} zoom={params.zoom} />
  )
}