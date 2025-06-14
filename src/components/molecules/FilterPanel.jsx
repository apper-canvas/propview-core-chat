import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Badge from '@/components/atoms/Badge'

export default function FilterPanel({ filters, onFiltersChange, isOpen, onToggle }) {
  const [localFilters, setLocalFilters] = useState(filters)

  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
  }

  const handleApplyFilters = () => {
    onFiltersChange(localFilters)
    if (window.innerWidth < 768) {
      onToggle()
    }
  }

  const handleClearFilters = () => {
    const clearedFilters = {
      priceMin: '',
      priceMax: '',
      bedrooms: '',
      bathrooms: '',
      propertyType: [],
      location: '',
      sortBy: ''
    }
    setLocalFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const propertyTypes = ['House', 'Condo', 'Townhouse', 'Apartment']

  const hasActiveFilters = Object.values(localFilters).some(value => 
    Array.isArray(value) ? value.length > 0 : value !== '' && value !== null
  )

  const filterSections = [
    {
      title: 'Price Range',
      content: (
        <div className="grid grid-cols-2 gap-3">
          <Input
            type="number"
            placeholder="Min Price"
            value={localFilters.priceMin || ''}
            onChange={(e) => handleFilterChange('priceMin', e.target.value ? Number(e.target.value) : '')}
          />
          <Input
            type="number"
            placeholder="Max Price"
            value={localFilters.priceMax || ''}
            onChange={(e) => handleFilterChange('priceMax', e.target.value ? Number(e.target.value) : '')}
          />
        </div>
      )
    },
    {
      title: 'Bedrooms & Bathrooms',
      content: (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Bedrooms
            </label>
            <select
              value={localFilters.bedrooms || ''}
              onChange={(e) => handleFilterChange('bedrooms', e.target.value ? Number(e.target.value) : '')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Bathrooms
            </label>
            <select
              value={localFilters.bathrooms || ''}
              onChange={(e) => handleFilterChange('bathrooms', e.target.value ? Number(e.target.value) : '')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </div>
        </div>
      )
    },
    {
      title: 'Property Type',
      content: (
        <div className="space-y-2">
          {propertyTypes.map(type => (
            <label key={type} className="flex items-center">
              <input
                type="checkbox"
                checked={(localFilters.propertyType || []).includes(type)}
                onChange={(e) => {
                  const currentTypes = localFilters.propertyType || []
                  const newTypes = e.target.checked
                    ? [...currentTypes, type]
                    : currentTypes.filter(t => t !== type)
                  handleFilterChange('propertyType', newTypes)
                }}
                className="rounded border-gray-300 text-secondary focus:ring-secondary"
              />
              <span className="ml-2 text-sm text-gray-700">{type}</span>
            </label>
          ))}
        </div>
      )
    },
    {
      title: 'Sort By',
      content: (
        <select
          value={localFilters.sortBy || ''}
          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
        >
          <option value="">Default</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="date-new">Newest First</option>
          <option value="date-old">Oldest First</option>
          <option value="size-large">Largest First</option>
          <option value="size-small">Smallest First</option>
        </select>
      )
    }
  ]

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="md:hidden mb-4">
        <Button
          variant="outline"
          onClick={onToggle}
          icon={isOpen ? "X" : "Filter"}
          className="w-full justify-center"
        >
          {isOpen ? 'Close Filters' : 'Show Filters'}
          {hasActiveFilters && (
            <Badge variant="accent" size="sm" className="ml-2">
              Active
            </Badge>
          )}
        </Button>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {(isOpen || window.innerWidth >= 768) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900 flex items-center">
                <ApperIcon name="Filter" className="w-5 h-5 mr-2" />
                Filters
              </h3>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Clear All
                </Button>
              )}
            </div>

            <div className="space-y-6">
              {filterSections.map((section, index) => (
                <div key={section.title}>
                  <h4 className="font-medium text-gray-700 mb-3">
                    {section.title}
                  </h4>
                  {section.content}
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                variant="primary"
                onClick={handleApplyFilters}
                className="flex-1"
              >
                Apply Filters
              </Button>
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="flex-1"
              >
                Clear
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}