import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StandardCard from '../components/StandardCard';
import ElevatedCard from '../components/ElevatedCard';

const Marketplace = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get('/marketplace-items');
        setItems(res.data.data.items);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const categories = ['All', ...new Set(items.map(item => item.category))];
  const filteredItems = categoryFilter === 'All' ? items : items.filter(item => item.category === categoryFilter);

  const truncateId = (id) => {
    if (!id) return '';
    return id.substring(id.length - 4).toUpperCase();
  };

  return (
    <div className="flex flex-col relative">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-[var(--color-cream)]">Campus Marketplace</h1>
        
        {/* Filter Input */}
        <div className="relative w-full md:w-auto">
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full md:w-auto appearance-none bg-[#17140F] border border-[#3A362E] text-[var(--color-cream)] px-4 py-2 pr-8 rounded-lg focus:outline-none focus:border-[var(--color-coral)] focus:ring-1 focus:ring-[var(--color-coral)] transition-colors cursor-pointer text-sm font-medium"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {/* Custom dropdown arrow to match theme */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[var(--color-muted)]">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-[var(--color-muted)] py-12">Loading Items...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.length === 0 && (
            <div className="col-span-full bg-[#25221C] p-8 rounded-xl text-center text-[var(--color-muted)] border border-[#3A362E]">
              No items found.
            </div>
          )}
          {filteredItems.map(item => {
            // If we had a verified seller flag, we would use ElevatedCard.
            // For now, all are StandardCard.
            const isVerified = false; 
            const CardComponent = isVerified ? ElevatedCard : StandardCard;
            
            return (
              <CardComponent 
                key={item._id}
                eyebrow={item.category}
                leftValue={`${'\u20B9'}${item.price}`}
                rightCode={`MP-${truncateId(item._id)}`}
              >
                <p className="line-clamp-3 leading-relaxed mb-4">{item.description}</p>
                <div className="mt-auto text-[10px] text-[var(--color-muted)]/70 tracking-widest uppercase">
                  Seller: {item.seller_id.substring(0,8)}...
                </div>
              </CardComponent>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Marketplace;
