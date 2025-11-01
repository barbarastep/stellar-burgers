import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredients-slice';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();

  const { items, isLoading } = useSelector((s) => s.ingredients);
  const ingredient = items.find((i) => i._id === id) || null;

  // Если зашли напрямую или стор пуст — подгрузить ингредиенты
  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, items.length]);

  // Лоадер пока нет данных
  if (isLoading || (!ingredient && items.length === 0)) {
    return <Preloader />;
  }

  // Если данные уже есть, но id не найден
  if (!ingredient) {
    return null;
  }

  return <IngredientDetailsUI ingredientData={ingredient} />;
};
