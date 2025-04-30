export interface MapType {
    id: number
    name: string
    skin: string
    zone: string
    scaleMin: number
    scaleMax: number
    huntingId: number
    cacheId: number | null
    cache: any
    spotMap: Array<{
        id: number
        spotId: number
        mapId: number
        spot: {
            id: number
            lat: string
            long: string
            description: string
            typeId: number
        }
    }>
}