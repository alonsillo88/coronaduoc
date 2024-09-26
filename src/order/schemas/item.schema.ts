import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Item {
  @Field()
  lineNumber: number;

  @Field()
  productId: number;

  @Field({ nullable: true })
  status: string;

  @Field({ nullable: true })
  statusDescription: string;

  @Field({ nullable: true })
  categoryId: number;

  @Field({ nullable: true })
  categoryDescription: string;

  @Field({ nullable: true })
  subCategoryId: number;

  @Field({ nullable: true })
  subCategoryDescription: string;

  @Field({ nullable: true })
  classId: number;

  @Field({ nullable: true })
  classDescription: string;

  @Field({ nullable: true })
  locationTypesId: number;

  @Field({ nullable: true })
  locationTypesDescription: string;

  @Field()
  sku: number;

  @Field()
  skuVerifyDigit: string;

  @Field()
  externalSku: string;

  @Field()
  skuName: string;

  @Field()
  skuDescShort: string;

  @Field({ nullable: true })
  ean: number;

  @Field({ nullable: true })
  color: string;

  @Field({ nullable: true })
  size: number;

  @Field()
  quantity: number;

  @Field()
  shortQty: number;

  @Field()
  price: number;

  @Field()
  discount: number;

  @Field({ nullable: true })
  couponWeb: string;

  @Field()
  currencyCode: string;

  @Field({ nullable: true })
  imageUrl: string;

  @Field()
  total: number;

  @Field()
  isGift: boolean;
}
