import type { HttpContext } from '@adonisjs/core/http'
import Map from '#models/map'
import Spot from '#models/spot'
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
}