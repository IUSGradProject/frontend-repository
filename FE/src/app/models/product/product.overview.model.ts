import { LoV } from "../lov.model";

export interface ProductOverview {
    productId: string;
    name: string;
    image: string;
    description: string;
    price: number;
    soldItems: number;
    available: number;
    isEditing: boolean;
    category: LoV;
    brand: LoV;
    power: LoV;
    style: LoV;
    materials: LoV[];
  }