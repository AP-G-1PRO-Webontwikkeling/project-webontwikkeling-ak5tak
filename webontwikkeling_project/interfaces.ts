export interface Watch
{
    id: number;
    model: string;
    description: string;
    price: number;
    special_edition: boolean;
    release_date: Date;
    image: string;
    material_type: string;
    colors: string[];
    measurements: Measurement[];
}

export interface Measurement
{
    measurement_id: string;
    size: number;
    thickness: number;
    water_resistance: number;
}