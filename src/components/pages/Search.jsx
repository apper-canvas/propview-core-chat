import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { propertyService } from '@/services'
import SearchBar from '@/components/molecules/SearchBar'
import FilterPanel from '@/components/molecules/FilterPanel'
import PropertyGrid from '@/components/organisms/PropertyGrid'
import PropertyDetail from '@/components/organisms/PropertyDetail'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'

export default function Search() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [showPropertyDetail, setShowPropertyDetail] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    bedrooms: '',
    bathrooms: '',
    propertyType: [],
    location: '',
    sortBy: ''
  })

  const loadProperties = async (searchFilters = filters) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await propertyService.getAll(searchFilters)
      setProperties(result)
    } catch (err) {
      setError(err.message || 'Failed to load properties')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProperties()
  }, [])

  const handleSearch = (searchTerm) => {
    const newFilters = { ...filters, location: searchTerm }
    setFilters(newFilters)
    loadProperties(newFilters)
  }

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
    loadProperties(newFilters)
    setFiltersOpen(false)
  }

  const handleViewDetails = (property) => {
    setSelectedProperty(property)
    setShowPropertyDetail(true)
  }

  const handleCloseDetail = () => {
    setShowPropertyDetail(false)
    setSelectedProperty(null)
  }

  const hasActiveFilters = Object.values(filters).some(value => 
    Array.isArray(value) ? value.length > 0 : value !== '' && value !== null
  )

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.priceMin || filters.priceMax) count++
    if (filters.bedrooms) count++
    if (filters.bathrooms) count++
    if (filters.propertyType && filters.propertyType.length > 0) count++
    if (filters.location) count++
    if (filters.sortBy) count++
    return count
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Find Your Perfect Home
          </h1>
          <p className="text-gray-600">
            Discover properties that match your lifestyle and budget
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mb-6"
        >
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search by city, neighborhood, or address..."
          />
        </motion.div>

        {/* Results Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-medium text-gray-900">
              {loading ? 'Searching...' : `${properties.length} Properties`}
            </h2>
            {hasActiveFilters && (
              <Badge variant="accent" size="sm">
                {getActiveFiltersCount()} Filter{getActiveFiltersCount() !== 1 ? 's' : ''} Active
              </Badge>
            )}
          </div>
          
          {/* View Toggle (Future feature) */}
          <div className="hidden md:flex items-center space-x-2">
            <button className="p-2 bg-primary text-white rounded-md">
              <ApperIcon name="Grid3X3" className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-md">
              <ApperIcon name="List" className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="lg:sticky lg:top-6">
              <FilterPanel
                filters={filters}
                onFiltersChange={handleFiltersChange}
                isOpen={filtersOpen}
                onToggle={() => setFiltersOpen(!filtersOpen)}
              />
            </div>
          </motion.div>

          {/* Properties Grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="lg:col-span-3"
          >
            <PropertyGrid
              properties={properties}
              loading={loading}
              error={error}
              onViewDetails={handleViewDetails}
              onRetry={() => loadProperties()}
            />
          </motion.div>
        </div>
      </div>

      {/* Property Detail Modal */}
      <PropertyDetail
        property={selectedProperty}
        isOpen={showPropertyDetail}
        onClose={handleCloseDetail}
      />
    </div>
  )
}