import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StandardCard from '../components/StandardCard';
import ElevatedCard from '../components/ElevatedCard';

const Marketplace = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null); // State for the modal
  const [isSellModalOpen, setIsSellModalOpen] = useState(false); // State for the sell modal
  const [newProduct, setNewProduct] = useState({
    category: 'Electronics',
    price: '',
    description: '',
    image: '',
    whatsappNumber: ''
  });

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

  const handleSellSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/marketplace-items', newProduct);
      setItems(prev => [res.data.data.item, ...prev]);
      setIsSellModalOpen(false);
      setNewProduct({ category: 'Electronics', price: '', description: '', image: '', whatsappNumber: '' });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to list product');
    }
  };

  return (
    <div className="flex flex-col relative">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-[var(--color-cream)]">Campus Marketplace</h1>
        
        <div className="flex flex-row items-center gap-4 w-full md:w-auto">
          <button 
            onClick={() => setIsSellModalOpen(true)}
            className="bg-[var(--color-coral)] text-[#17140F] font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap text-sm"
          >
            Sell Product
          </button>
          
          {/* Filter Input */}
          <div className="relative w-full md:w-auto flex-grow">
            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full appearance-none bg-[#17140F] border border-[#3A362E] text-[var(--color-cream)] px-4 py-2 pr-8 rounded-lg focus:outline-none focus:border-[var(--color-coral)] focus:ring-1 focus:ring-[var(--color-coral)] transition-colors cursor-pointer text-sm font-medium"
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
            const isVerified = false; 
            const CardComponent = isVerified ? ElevatedCard : StandardCard;
            
            return (
              <div key={item._id} onClick={() => setSelectedItem(item)} className="cursor-pointer hover:-translate-y-1 transition-transform h-full flex flex-col">
                <CardComponent 
                  eyebrow={item.category}
                  leftValue={`${'\u20B9'}${item.price}`}
                  rightCode={`MP-${truncateId(item._id)}`}
                  className="h-full"
                >
                  {/* Image container inside the card content */}
                  <div className="w-full h-32 md:h-40 rounded-lg overflow-hidden mb-4 bg-[#17140F]">
                    <img 
                      src={item.image || 'https://via.placeholder.com/300?text=No+Image+Available'} 
                      alt="Product" 
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=Image+Load+Failed'; }}
                    />
                  </div>
                  <p className="line-clamp-2 leading-relaxed mb-4 text-[var(--color-cream)] text-sm">{item.description}</p>
                  <div className="mt-auto text-[10px] text-[var(--color-muted)]/70 tracking-widest uppercase">
                    Seller: {item.seller_id.substring(0,8)}...
                  </div>
                </CardComponent>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for Item Details */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedItem(null)}>
          <div 
            className="bg-[#17140F] border border-[#3A362E] rounded-xl overflow-hidden shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]"
            onClick={e => e.stopPropagation()} // Prevent clicking inside modal from closing it
          >
            {/* Modal Image */}
            <div className="w-full h-48 sm:h-64 bg-[#25221C] relative">
              <img 
                src={selectedItem.image || 'https://via.placeholder.com/600x400?text=No+Image+Available'} 
                alt="Product details" 
                className="w-full h-full object-contain"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/600x400?text=Image+Load+Failed'; }}
              />
              {/* Close Button */}
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-2 hover:bg-black transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-grow">
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-[10px] text-[var(--color-muted)] tracking-widest uppercase bg-[#25221C] px-2 py-1 rounded">
                  {selectedItem.category}
                </span>
                <span className="font-mono text-lg text-[var(--color-coral)] font-bold">
                  {'\u20B9'}{selectedItem.price}
                </span>
              </div>
              
              <h2 className="text-xl font-display font-bold text-[var(--color-cream)] mb-4 mt-2">
                Product Details
              </h2>
              
              <div className="text-[var(--color-muted)] text-sm mb-6 whitespace-pre-wrap leading-relaxed">
                {selectedItem.description}
              </div>
              
              <div className="text-[10px] text-[var(--color-muted)]/70 tracking-widest uppercase mb-4">
                Seller ID: {selectedItem.seller_id}
              </div>
            </div>
            
            {/* Modal Footer with Actions */}
            <div className="p-6 border-t border-[#3A362E] bg-[#25221C]">
              <a 
                href={`https://wa.me/${selectedItem.whatsappNumber || ''}?text=Hi%2C%20I%20am%20interested%20in%20your%20item%20(MP-${truncateId(selectedItem._id)})%20on%20DayScholar%20Marketplace`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex justify-center items-center gap-2 bg-[var(--color-coral)] text-[#17140F] font-bold py-3 rounded-lg hover:opacity-90 transition-opacity"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
                Contact Seller
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Selling a New Product */}
      {isSellModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsSellModalOpen(false)}>
          <div 
            className="bg-[#17140F] border border-[#3A362E] rounded-xl overflow-hidden shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]"
            onClick={e => e.stopPropagation()} // Prevent closing
          >
            <div className="p-6 border-b border-[#3A362E] flex justify-between items-center bg-[#25221C]">
              <h2 className="text-xl font-display font-bold text-[var(--color-cream)]">Sell a Product</h2>
              <button 
                onClick={() => setIsSellModalOpen(false)}
                className="text-[var(--color-muted)] hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-grow">
              <form onSubmit={handleSellSubmit} className="space-y-4">
                <div>
                  <label className="block text-[var(--color-muted)] text-sm mb-1">Category</label>
                  <select 
                    required
                    value={newProduct.category}
                    onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                    className="w-full bg-[#25221C] border border-[#3A362E] rounded-lg p-2.5 text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-coral)] transition-colors"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Books">Books</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Stationery">Stationery</option>
                    <option value="Misc">Misc</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[var(--color-muted)] text-sm mb-1">Price (₹)</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    value={newProduct.price}
                    onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                    className="w-full bg-[#25221C] border border-[#3A362E] rounded-lg p-2.5 text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-coral)] transition-colors placeholder:text-[#3A362E]"
                    placeholder="Enter price"
                  />
                </div>

                <div>
                  <label className="block text-[var(--color-muted)] text-sm mb-1">Image Link (URL)</label>
                  <input 
                    type="url" 
                    value={newProduct.image}
                    onChange={e => setNewProduct({...newProduct, image: e.target.value})}
                    className="w-full bg-[#25221C] border border-[#3A362E] rounded-lg p-2.5 text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-coral)] transition-colors placeholder:text-[#3A362E]"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-[var(--color-muted)] text-sm mb-1">WhatsApp Number</label>
                  <input 
                    type="tel" 
                    required
                    value={newProduct.whatsappNumber}
                    onChange={e => setNewProduct({...newProduct, whatsappNumber: e.target.value})}
                    className="w-full bg-[#25221C] border border-[#3A362E] rounded-lg p-2.5 text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-coral)] transition-colors placeholder:text-[#3A362E]"
                    placeholder="e.g. 919876543210"
                  />
                  <p className="text-[10px] text-[var(--color-muted)] mt-1 tracking-wider uppercase">Include country code without '+'</p>
                </div>

                <div>
                  <label className="block text-[var(--color-muted)] text-sm mb-1">Description</label>
                  <textarea 
                    required
                    rows="3"
                    value={newProduct.description}
                    onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                    className="w-full bg-[#25221C] border border-[#3A362E] rounded-lg p-2.5 text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-coral)] transition-colors placeholder:text-[#3A362E]"
                    placeholder="Describe your product... (Do not include phone numbers or UPI IDs here)"
                  ></textarea>
                </div>
                
                <div className="pt-4 border-t border-[#3A362E]">
                  <button 
                    type="submit"
                    className="w-full flex justify-center items-center gap-2 bg-[var(--color-coral)] text-[#17140F] font-bold py-3 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    List Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;

