import { Minus, Plus, Trash2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addItemToCart } from '../../store/slices/cartSlice';

const CartItem = ({ item, onRemove, onRemoveEntire }) => {
  const dispatch = useDispatch();

  const handleAddItem = () => {
    dispatch(addItemToCart(item));
  };

  return (
    <li className="bg-white rounded-xl p-3 md:p-4 shadow-sm border border-slate-100">
      <div className="flex items-start space-x-3 md:space-x-4">
        {/* Product Image */}
        <div className="h-16 w-16 md:h-20 md:w-20 flex-shrink-0 overflow-hidden rounded-lg border border-slate-200">
          <img
            src={item.images[0]}
            alt={item.name}
            className="h-full w-full object-cover object-center"
          />
        </div>
        
        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm md:text-base font-semibold text-slate-900 line-clamp-2 mb-1">
                {item.name}
              </h3>
              <p className="text-xs md:text-sm text-slate-500 mb-2">{item.brand}</p>
            </div>
            <div className="flex-shrink-0 md:ml-4">
              <p className="text-sm md:text-base font-bold text-slate-900">
                ${item.price.toFixed(2)}
              </p>
            </div>
          </div>
          
          {/* Quantity Controls & Remove */}
          <div className="flex items-center justify-between">
            <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden">
              <button
                onClick={onRemove}
                className="p-1.5 md:p-2 hover:bg-slate-100 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="h-3 w-3 md:h-4 md:w-4" />
              </button>
              <span className="px-2 md:px-3 py-1 text-sm md:text-base font-medium min-w-[2rem] text-center">
                {item.quantity}
              </span>
              <button
                onClick={handleAddItem}
                className="p-1.5 md:p-2 hover:bg-slate-100 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="h-3 w-3 md:h-4 md:w-4" />
              </button>
            </div>
            
            <button
              onClick={onRemoveEntire}
              className="text-slate-500 hover:text-red-500 p-1.5 md:p-2 transition-colors"
              aria-label="Remove item"
            >
              <Trash2 className="h-4 w-4 md:h-5 md:w-5" />
            </button>
          </div>
          
          {/* Item Total */}
          <div className="mt-2 text-right">
            <p className="text-xs md:text-sm text-slate-600">
              Total: <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
            </p>
          </div>
        </div>
      </div>
    </li>
  );
};

export default CartItem;