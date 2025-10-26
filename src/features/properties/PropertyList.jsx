import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProperties } from './propertySlice';

const PropertyList = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.properties);

  useEffect(() => {
    dispatch(fetchProperties());
  }, [dispatch]);

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p>Hata: {error}</p>;

  return (
    <div>
      <h2>Property Listesi</h2>
      <ul>
        {items.map((p) => (
          <li key={p.id}>
            {p.title} — {p.city} — {p.price} ₺
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PropertyList;
