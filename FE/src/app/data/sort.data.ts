import { Sort } from "../models/sort.model";


export function getSortData(): Sort[]{
    return [
        {
            name: 'A to Z',
            sortBy: 'name',
            sortDesc: false
        },
        {
            name: 'Z to A',
            sortBy: 'name',
            sortDesc: true
        },
        {
            name: 'Highest to lowest price',
            sortBy: 'price',
            sortDesc: true
        },
        {
            name: 'Lowest to highest price',
            sortBy: 'price',
            sortDesc: false
        },
    ]
}