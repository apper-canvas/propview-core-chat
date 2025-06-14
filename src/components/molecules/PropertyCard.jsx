import { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import { favoriteService } from '@/services'
import { toast } from 'react-toastify'

export default function PropertyCard({ property, onViewDetails }) {
  const [isFavorite, setIsFavorite] = useState(
    favoriteService.isFavoriteSync(property.id)
  )
  const [favoriteLoading, setFavoriteLoading] = useState(false)

  const handleFavoriteToggle = async (e) => {
    e.stopPropagation()
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

  return (
    <Card className="cursor-pointer" onClick={() => onViewDetails(property)}>
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'
          }}
        />
        
        {/* Property Type Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="primary" size="sm">
            {property.propertyType}
          </Badge>
        </div>

        {/* Favorite Button */}
        <div className="absolute top-3 right-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleFavoriteToggle}
            disabled={favoriteLoading}
            className={`p-2 rounded-full shadow-lg transition-colors duration-200 ${
              isFavorite 
                ? 'bg-accent text-white' 
                : 'bg-white text-gray-400 hover:text-accent'
            }`}
          >
            <ApperIcon 
              name={favoriteLoading ? "Loader2" : "Heart"} 
              className={`w-5 h-5 ${favoriteLoading ? 'animate-spin' : ''} ${
                isFavorite ? 'fill-current' : ''
              }`} 
            />
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Price */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-primary">
            {formatPrice(property.price)}
          </h3>
        </div>

        {/* Title */}
        <h4 className="font-medium text-gray-900 mb-2 line-clamp-1">
          {property.title}
        </h4>

        {/* Address */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-1">
          <ApperIcon name="MapPin" className="w-4 h-4 inline mr-1" />
          {property.address}
        </p>

        {/* Property Details */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <ApperIcon name="Bed" className="w-4 h-4 mr-1" />
              <span>{property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center">
              <ApperIcon name="Bath" className="w-4 h-4 mr-1" />
              <span>{property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center">
              <ApperIcon name="Home" className="w-4 h-4 mr-1" />
              <span>{formatSqft(property.sqft)} sqft</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button 
          variant="outline" 
          className="w-full"
          onClick={(e) => {
            e.stopPropagation()
            onViewDetails(property)
          }}
        >
          View Details
        </Button>
      </div>
    </Card>
  )
}