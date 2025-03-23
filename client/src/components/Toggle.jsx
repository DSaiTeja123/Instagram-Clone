import React, { useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setColorToggled } from '../store/authSlice';

const Toggle = () => {
  const dispatch = useDispatch();
  const colorToggled = useSelector((state) => state.auth.colorToggled);

  useEffect(() => {
    const theme = colorToggled ? 'dark' : 'light';
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [colorToggled]);

  const toggleTheme = () => {
    dispatch(setColorToggled(!colorToggled));
  };

  return (
    <div className="fixed bottom-4 right-4 flex items-center justify-center">
      <button
        onClick={toggleTheme}
        className="p-3 rounded-full shadow-md transition-all duration-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        {colorToggled ? <Moon size={24} /> : <Sun size={24} />}
      </button>
    </div>
  );
};

export default Toggle;
