import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { favoriteService, propertyService } from '@/services'
import PropertyGrid from '@/components/organisms/PropertyGrid'
import PropertyDetail from '@/components/organisms/PropertyDetail'
import EmptyState from '@/components/atoms/EmptyState'
import ErrorState from '@/components/atoms/ErrorState'
import SkeletonLoader from '@/components/atoms/SkeletonLoader'
import Button from '@/components/atoms/Button'
import { toast } from 'react-toastify'

export default function Saved() {
  const [savedProperties, setSavedProperties] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [showPropertyDetail, setShowPropertyDetail] = useState(false)

  const loadSavedProperties = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Get favorite property IDs
      const favorites = await favoriteService.getAll()
      
      if (favorites.length === 0) {
        setSavedProperties([])
        return
      }

      // Get all properties and filter for favorites
      const allProperties = await propertyService.getAll()
      const favoriteProperties = allProperties.filter(property =>
        favorites.some(fav => fav.propertyId === property.id)
      )
      
      // Sort by date added to favorites (most recent first)
      const sortedProperties = favoriteProperties.sort((a, b) => {
        const aFav = favorites.find(fav => fav.propertyId === a.id)
        const bFav = favorites.find(fav => fav.propertyId === b.id)
        return new Date(bFav.addedDate) - new Date(aFav.addedDate)
      })

      setSavedProperties(sortedProperties)
    } catch (err) {
      setError(err.message || 'Failed to load saved properties')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSavedProperties()
  }, [])

  const handleViewDetails = (property) => {
    setSelectedProperty(property)
    setShowPropertyDetail(true)
  }

  const handleCloseDetail = () => {
    setShowPropertyDetail(false)
    setSelectedProperty(null)
    // Refresh saved properties in case favorites changed
    loadSavedProperties()
  }

  const handleClearAllFavorites = async () => {
    if (!window.confirm('Are you sure you want to remove all saved properties?')) {
      return
    }

    try {
      // Remove all favorites
      const favorites = await favoriteService.getAll()
      await Promise.all(
        favorites.map(fav => favoriteService.remove(fav.propertyId))
      )
      
      setSavedProperties([])
      toast.success('All saved properties removed')
    } catch (error) {
      toast.error('Failed to clear saved properties')
      console.error('Clear favorites error:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonLoader count={6} type="card" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorState
            title="Failed to load saved properties"
            message={error}
            onRetry={loadSavedProperties}
          />
        </div>
      </div>
    )
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
                Saved Properties
              </h1>
              <p className="text-gray-600">
                {savedProperties.length === 0 
                  ? 'No saved properties yet'
                  : `${savedProperties.length} propert${savedProperties.length !== 1 ? 'ies' : 'y'} saved`
                }
              </p>
            </div>
            
            {savedProperties.length > 0 && (
              <Button
                variant="outline"
                onClick={handleClearAllFavorites}
                className="text-error border-error hover:bg-error hover:text-white"
              >
                Clear All
              </Button>
            )}
          </div>
        </motion.div>

        {/* Content */}
        {savedProperties.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <EmptyState
              icon="Heart"
              title="No saved properties yet"
              description="Start browsing properties and save your favorites to see them here. Click the heart icon on any property to add it to your saved list."
              actionLabel="Browse Properties"
              onAction={() => window.location.href = '/search'}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <PropertyGrid
              properties={savedProperties}
              loading={false}
              error={null}
              onViewDetails={handleViewDetails}
              onRetry={loadSavedProperties}
            />
          </motion.div>
        )}
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