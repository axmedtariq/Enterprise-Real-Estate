// frontend/src/components/features/SearchManager.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProperties, setFilters } from '../../store/slices/propertySlice';
import SearchHero from './SearchHero'; // The UI we built earlier

export default function SearchManager() {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.properties);

  // Trigger API call whenever filters change
  useEffect(() => {
    dispatch(fetchProperties(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (newFilter) => {
    dispatch(setFilters(newFilter));
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="pt-20 pb-10 px-4">
        {/* Pass filter logic to the Search Bar */}
        <SearchHero onFilterChange={handleFilterChange} currentFilters={filters} />
      </div>
      
      {/* Property Results Grid would go here */}
    </div>
  );
}