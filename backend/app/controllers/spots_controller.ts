import type { HttpContext } from '@adonisjs/core/http'
import Map from '#models/map'
import Spot from '#models/spot'
import SpotMap from '#models/spot_map'
export default class SpotsController {
    async getSpot ({ response, request }: HttpContext) {
        const { id } = request.only(['id'])
        const spotMap = await Map.query().preload('spotMap').where('id', id).first()        
        let markers: { position: number[]; label: string }[] = []
        let square: { topLeft: number[], topRight: number[], bottomLeft: number[], bottomRight: number[] } = { topLeft: [], topRight: [], bottomLeft: [], bottomRight: [] }
        let center: number[] = []
        if (spotMap) {
            await Promise.all(spotMap.spotMap.map(async (spot) => {
                const resultSpot = await Spot.findBy('id', spot.spotId);
                if (resultSpot) {
                    switch (resultSpot.typeId) {
                        case 1:
                            markers.push({
                                position: [resultSpot.lat, resultSpot.long],
                                label: resultSpot.description
                            });
                            break;
                        case 2:
                            square.topLeft = [resultSpot.lat, resultSpot.long];
                            break;
                        case 3:
                            square.topRight = [resultSpot.lat, resultSpot.long];
                            break;
                        case 4:
                            square.bottomLeft = [resultSpot.lat, resultSpot.long];
                            break;
                        case 5:
                            square.bottomRight = [resultSpot.lat, resultSpot.long];
                            break;
                        case 6:
                            center = [resultSpot.lat, resultSpot.long];
                            break;
                    }
                }
            }));
            return response.ok({ center, markers, square, zoom: spotMap.scale_max, status: true });
        }
    }
    async pushSpotInMap ({ response, request }: HttpContext) {
        
        const { markers, square, center, zoom, status } = request.only(['markers', 'square', 'center', 'zoom', 'status'])
        const map = new Map()        
        map.scale_max = zoom
        map.scale_min = 1
        map.name = "nameMap"
        map.skin = "skinMap"
        map.zone = "zoneMap"
        map.huntingId = 1
        await map.save()
        markers.map(async (marker: { position: number[]; label: string }) => {
            const spot = new Spot()
            spot.lat = marker.position[0]
            spot.long = marker.position[1]
            spot.description = marker.label
            spot.typeId = 1
            await spot.save()
            const spotMap = new SpotMap()
            spotMap.mapId = map.id
            spotMap.spotId = spot.id
            await spotMap.save()
        })
        if (square.topLeft.length > 0) {
            const spot = new Spot()
            spot.lat = square.topLeft[0]
            spot.long = square.topLeft[1]
            spot.description = "topLeft"
            spot.typeId = 2
            await spot.save()
            const spotMap = new SpotMap()
            spotMap.mapId = map.id
            spotMap.spotId = spot.id
            await spotMap.save()
        }
        if (square.topRight.length > 0) {
            const spot = new Spot()
            spot.lat = square.topRight[0]
            spot.long = square.topRight[1]
            spot.description = "topRight"
            spot.typeId = 3
            await spot.save()
            const spotMap = new SpotMap()
            spotMap.mapId = map.id
            spotMap.spotId = spot.id
            await spotMap.save()
        }
        if (square.bottomLeft.length > 0) {
            const spot = new Spot()
            spot.lat = square.bottomLeft[0]
            spot.long = square.bottomLeft[1]
            spot.description = "bottomLeft"
            spot.typeId = 4
            await spot.save()
            const spotMap = new SpotMap()
            spotMap.mapId = map.id
            spotMap.spotId = spot.id
            await spotMap.save()
        }
        if (square.bottomRight.length > 0) {
            const spot = new Spot()
            spot.lat = square.bottomRight[0]
            spot.long = square.bottomRight[1]
            spot.description = "bottomRight"
            spot.typeId = 5
            await spot.save()
            const spotMap = new SpotMap()
            spotMap.mapId = map.id
            spotMap.spotId = spot.id
            await spotMap.save()
        }
        if (center.length > 0) {
            const spot = new Spot()
            spot.lat = center[0]
            spot.long = center[1]
            spot.description = "center"
            spot.typeId = 6
            await spot.save()
            const spotMap = new SpotMap()
            spotMap.mapId = map.id
            spotMap.spotId = spot.id
            await spotMap.save()
        }
        return response.ok(true);
    }
}