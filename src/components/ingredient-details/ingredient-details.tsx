import { FC, useEffect } from 'react';
import { useParams, useLocation, Location } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredients-slice';
import { Preloader } from '@ui';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import commonStyles from '@ui-pages/common.module.css';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  type LocationState = { background?: Location } | null;
  const location = useLocation() as Location & { state: LocationState };
  const hasBackground = Boolean(location?.state?.background);

  const dispatch = useDispatch();
  const { items, isLoading } = useSelector((s) => s.ingredients);
  const ingredient = items.find((i) => i._id === id) || null;

  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, items.length]);

  if (isLoading || (!ingredient && items.length === 0)) {
    return <Preloader />;
  }

  if (!ingredient) return null;

  if (!hasBackground) {
    return (
      <main className={commonStyles.container}>
        <div className={commonStyles.wrapCenter}>
          <h1 className='text text_type_main-large pb-6'>Детали ингредиента</h1>
          <IngredientDetailsUI ingredientData={ingredient} />
        </div>
      </main>
    );
  }

  return <IngredientDetailsUI ingredientData={ingredient} />;
};
