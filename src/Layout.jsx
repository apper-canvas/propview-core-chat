import React, { useContext, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import ApperIcon from "./components/ApperIcon";
import Button from "./components/atoms/Button";
import { AuthContext } from "./App";
import { routes } from "@/config/routes";
export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user } = useSelector((state) => state.user)
  const { logout } = useContext(AuthContext)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
    {/* Header */}
    <header className="flex-shrink-0 bg-white border-b border-gray-200 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
                {/* Logo */}
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <h1 className="text-2xl font-display font-bold text-primary">PropView</h1>
                    </div>
                </div>
                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                    <nav className="flex space-x-8">
                        {Object.values(routes).map(route => <NavLink
                            key={route.id}
                            to={route.path}
                            className={(
                                {
                                    isActive
                                }
                            ) => `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive ? "text-primary bg-primary/10" : "text-gray-600 hover:text-primary hover:bg-primary/5"}`}>
                            <ApperIcon name={route.icon} className="w-4 h-4 mr-2" />
                            {route.label}
                        </NavLink>)}
                    </nav>
                    {/* User Actions */}
                    <div className="flex items-center space-x-4">
                        {user && <span className="text-sm text-gray-600">Welcome, {user.firstName || user.name || "User"}
                        </span>}
                        <Button
                            variant="outline"
                            size="sm"
                            icon="LogOut"
                            onClick={handleLogout}
                            className="text-gray-600 hover:text-primary">Logout
                                            </Button>
                    </div>
                </div>
                {/* Mobile menu button */}
                <div className="md:hidden">
                    <button
                        onClick={toggleMobileMenu}
                        className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-primary hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary">
                        <ApperIcon name={mobileMenuOpen ? "X" : "Menu"} className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
        {/* Mobile Navigation */}
        <AnimatePresence>
            {mobileMenuOpen && <motion.div
                initial={{
                    opacity: 0,
                    height: 0
                }}
                animate={{
                    opacity: 1,
                    height: "auto"
                }}
                exit={{
                    opacity: 0,
                    height: 0
                }}
                transition={{
                    duration: 0.3
                }}
                className="md:hidden border-t border-gray-200 bg-white">
                <div className="px-2 pt-2 pb-3 space-y-1">
                    {Object.values(routes).map(route => <NavLink
                        key={route.id}
                        to={route.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={(
                            {
                                isActive
                            }
                        ) => `flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isActive ? "text-primary bg-primary/10" : "text-gray-600 hover:text-primary hover:bg-primary/5"}`}>
                        <ApperIcon name={route.icon} className="w-5 h-5 mr-3" />
                        {route.label}
                    </NavLink>)}
                    {/* Mobile User Actions */}
                    <div className="border-t border-gray-200 pt-3 mt-3">
                        {user && <div className="px-3 py-2 text-sm text-gray-600">Welcome, {user.firstName || user.name || "User"}
                        </div>}
                        <button
                            onClick={() => {
                                setMobileMenuOpen(false);
                                handleLogout();
                            }}
                            className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-primary/5 transition-colors duration-200">
                            <ApperIcon name="LogOut" className="w-5 h-5 mr-3" />Logout
                                              </button>
                    </div>
                </div>
            </motion.div>}
        </AnimatePresence>
    </header>
    {/* Main Content */}
    <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-y-auto">
            <Outlet />
        </main>
    </div>
</div>
  )
}