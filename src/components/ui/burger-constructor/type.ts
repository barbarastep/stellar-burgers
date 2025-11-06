import { TOrder } from '@utils-types';
import { TConstructorIngredient } from '@utils-types';

export type BurgerConstructorUIProps = {
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  price: number;
  orderModalData: TOrder | null;
  onOrderClick: () => void;
  closeOrderModal: () => void;

  onItemMoveUp: (index: number) => void;
  onItemMoveDown: (index: number) => void;
  onItemRemove: (id: string) => void;
};
