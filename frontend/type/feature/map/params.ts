interface MapParams {
    status: boolean
    center: [number, number]
    zoom: number
    square: {
        topLeft: [number, number]
        topRight: [number, number]
        bottomLeft: [number, number]
        bottomRight: [number, number]
    }
    markers: {
        position: [number, number]
        label: string
    }[]
}

export default MapParams