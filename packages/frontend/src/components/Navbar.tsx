import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';

const Navbar: React.FC = () => {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "px-3 py-2 rounded-md text-sm font-medium transition-colors",
      isActive
        ? "bg-primary text-primary-foreground"
        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
    );

  return (
    <nav className="bg-card shadow-sm mb-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" className="text-xl font-semibold text-primary">
              mktdash
            </NavLink>
          </div>
          <div className="flex space-x-4">
            <NavLink to="/" className={linkClass}>
              Markets
            </NavLink>
            <NavLink to="/economic" className={linkClass}>
              Economic
            </NavLink>
            <NavLink to="/stability" className={linkClass}>
              Financial Stability
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
