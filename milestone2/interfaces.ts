import { ObjectId } from "mongodb";

export interface Watch
{
    _id: ObjectId;
    id: number;
    model: string;
    description: string;
    price: number;
    special_edition: boolean;
    release_date: Date;
    image: string;
    material_type: string;
    colors: string[];
    size_measurement: Measurement;
}

export interface Measurement
{
    size: number;
}