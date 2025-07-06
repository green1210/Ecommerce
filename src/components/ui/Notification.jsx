import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { hideNotification } from '../../store/slices/uiSlice';

const Notification = ({ message, type }) => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(hideNotification());
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [dispatch]);
  
  const handleClose = () => {
    dispatch(hideNotification());
  };
  
  const bgColor = {
    success: 'bg-success-100 border-success-500',
    error: 'bg-error-100 border-error-500',
    info: 'bg-primary-100 border-primary-500',
  };
  
  const textColor = {
    success: 'text-success-700',
    error: 'text-error-700',
    info: 'text-primary-700',
  };
  
  const Icon = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
  }[type];
  
  return (
    <AnimatePresence>
      <motion.div
        className="fixed top-24 right-4 z-50 max-w-sm"
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <div className={`rounded-lg shadow-lg border-l-4 p-4 ${bgColor[type]}`}>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Icon className={`h-5 w-5 ${textColor[type]}`} />
            </div>
            <div className="ml-3 flex-1">
              <p className={`text-sm font-medium ${textColor[type]}`}>{message}</p>
            </div>
            <div className="ml-4 flex-shrink-0">
              <button
                onClick={handleClose}
                className={`inline-flex ${textColor[type]} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Notification;