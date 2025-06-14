import { motion } from 'framer-motion'
import PropertyCard from '@/components/molecules/PropertyCard'
import SkeletonLoader from '@/components/atoms/SkeletonLoader'
import EmptyState from '@/components/atoms/EmptyState'
import ErrorState from '@/components/atoms/ErrorState'

export default function PropertyGrid({ 
  properties, 
  loading, 
  error, 
  onViewDetails,
  onRetry
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SkeletonLoader count={6} type="card" />
      </div>
    )
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load properties"
        message={error}
        onRetry={onRetry}
      />
    )
  }

  if (!properties || properties.length === 0) {
    return (
      <EmptyState
        icon="Home"
        title="No properties found"
        description="Try adjusting your search filters to find more properties."
        actionLabel="Clear Filters"
        onAction={() => window.location.reload()}
      />
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {properties.map((property, index) => (
        <motion.div
          key={property.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
        >
          <PropertyCard
            property={property}
            onViewDetails={onViewDetails}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}