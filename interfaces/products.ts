export interface IProduct {
    _id: string;
    description: string;
    images: string[];
    inStock: number;
    price: number;
    sizes: IValidSizes[];
    slug: string;
    tags: string[];
    title: string;
    type: IValidTypes;
    gender: 'men'|'women'|'kid'|'unisex'

    //TODO: AGREGAR CREATED Y UPDATED
    createdAt: string;
    updatedAt: string;

}


export type IValidSizes = 'XS'|'S'|'M'|'L'|'XL'|'XXL'|'XXXL';
export type IValidTypes = 'shirts'|'pants'|'hoodies'|'hats';
