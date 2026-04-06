// src/components/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Users, UserPlus, Package, PackagePlus } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/customers', label: 'Customer Details', icon: Users },
    { path: '/customers/add', label: 'Add Customer', icon: UserPlus },
    { path: '/items', label: 'Items', icon: Package },
    { path: '/items/add', label: 'Add Items', icon: PackagePlus },
  ];

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed left-0 top-0 h-screen w-64 bg-white shadow-lg z-40 border-r border-gray-100"
    >
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Billing Hub
        </h1>
        <p className="text-xs text-gray-400 mt-1">Management Suite</p>
      </div>
      <nav className="mt-6 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-black text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            <item.icon size={18} />
            <span className="text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </motion.aside>
  );
};

export default Sidebar;