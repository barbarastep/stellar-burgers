import { TOrder } from '@utils-types';

export type BurgerConstructorUIProps = {
  constructorItems: any;
  orderRequest: boolean;
  price: number;
  orderModalData: TOrder | null;
  onOrderClick: () => void;
  closeOrderModal: () => void;

  onItemMoveUp: (index: number) => void;
  onItemMoveDown: (index: number) => void;
  onItemRemove: (id: string) => void;
};
