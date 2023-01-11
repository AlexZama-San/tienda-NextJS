export interface ICartProduct {
    _id: string;
    images: string;
    price: number;
    size?: IValidSize;
    slug: string;
    title: string;
    gender: 'men'|'women'|'kid'|'unisex'
    quantity: number
    inStock: number

}

    export type IValidSize = 'XS'|'S'|'M'|'L'|'XL'|'XXL'|'XXXL';
