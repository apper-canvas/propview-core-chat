import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import PropertyGallery from '@/components/molecules/PropertyGallery'
import { favoriteService } from '@/services'
import { toast } from 'react-toastify'
import { format } from 'date-fns'

export default function PropertyDetail({ property, isOpen, onClose }) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)

  useEffect(() => {
    if (property) {
      setIsFavorite(favoriteService.isFavoriteSync(property.id))
    }
  }, [property])

  const handleFavoriteToggle = async () => {
    setFavoriteLoading(true)
    
    try {
      if (isFavorite) {
        await favoriteService.remove(property.id)
        setIsFavorite(false)
        toast.success('Removed from favorites')
      } else {
        await favoriteService.add(property.id)
        setIsFavorite(true)
        toast.success('Added to favorites')
      }
    } catch (error) {
      toast.error('Failed to update favorites')
      console.error('Favorite toggle error:', error)
    } finally {
      setFavoriteLoading(false)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatSqft = (sqft) => {
    return new Intl.NumberFormat('en-US').format(sqft)
  }

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM dd, yyyy')
  }

  if (!property) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Badge variant="primary" size="sm">
                  {property.propertyType}
                </Badge>
                <span className="text-sm text-gray-500">
                  Listed {formatDate(property.listingDate)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={isFavorite ? "accent" : "outline"}
                  size="sm"
                  icon={favoriteLoading ? "Loader2" : "Heart"}
                  onClick={handleFavoriteToggle}
                  disabled={favoriteLoading}
                  className={isFavorite ? "text-white" : ""}
                >
                  {isFavorite ? 'Favorited' : 'Add to Favorites'}
                </Button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="p-6 space-y-6">
                {/* Gallery */}
                <PropertyGallery images={property.images} title={property.title} />

                {/* Property Info */}
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Main Details */}
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
                        {property.title}
                      </h1>
                      <p className="text-xl text-gray-600 flex items-center">
                        <ApperIcon name="MapPin" className="w-5 h-5 mr-2" />
                        {property.address}
                      </p>
                    </div>

                    {/* Key Stats */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">
                            {property.bedrooms}
                          </div>
                          <div className="text-sm text-gray-600">
                            Bedroom{property.bedrooms !== 1 ? 's' : ''}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">
                            {property.bathrooms}
                          </div>
                          <div className="text-sm text-gray-600">
                            Bathroom{property.bathrooms !== 1 ? 's' : ''}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">
                            {formatSqft(property.sqft)}
                          </div>
                          <div className="text-sm text-gray-600">
                            Square Feet
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">
                            ${Math.round(property.price / property.sqft)}
                          </div>
                          <div className="text-sm text-gray-600">
                            Price per sqft
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">
                        Description
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {property.description}
                      </p>
                    </div>

                    {/* Features */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">
                        Features & Amenities
                      </h3>
                      <div className="grid md:grid-cols-2 gap-2">
                        {property.features.map((feature, index) => (
                          <div key={index} className="flex items-center">
                            <ApperIcon name="Check" className="w-4 h-4 text-success mr-2 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Price */}
                    <div className="bg-primary text-white rounded-lg p-6 text-center">
                      <div className="text-3xl font-bold mb-2">
                        {formatPrice(property.price)}
                      </div>
                      <div className="text-primary-200">
                        ${Math.round(property.price / property.sqft)} per sqft
                      </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="font-medium text-gray-900 mb-4">
                        Contact Agent
                      </h3>
                      <div className="space-y-3">
                        <Button variant="primary" className="w-full" icon="Phone">
                          Call Agent
                        </Button>
                        <Button variant="outline" className="w-full" icon="Mail">
                          Send Message
                        </Button>
                        <Button variant="outline" className="w-full" icon="Calendar">
                          Schedule Tour
                        </Button>
                      </div>
                    </div>

                    {/* Map Placeholder */}
                    <div className="bg-gray-100 rounded-lg p-6 text-center">
                      <ApperIcon name="Map" className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <h4 className="font-medium text-gray-900 mb-2">
                        View on Map
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">
                        See neighborhood details and nearby amenities
                      </p>
                      <Button variant="outline" size="sm" icon="ExternalLink">
                        Open in Maps
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}