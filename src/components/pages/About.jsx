import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'

export default function About() {
  const features = [
    {
      icon: 'Search',
      title: 'Smart Search',
      description: 'Advanced filters help you find exactly what you\'re looking for in seconds.'
    },
    {
      icon: 'Heart',
      title: 'Save Favorites',
      description: 'Keep track of properties you love and compare them side by side.'
    },
    {
      icon: 'ImageIcon',
      title: 'High-Quality Photos',
      description: 'Stunning property galleries with fullscreen viewing capabilities.'
    },
    {
      icon: 'MapPin',
      title: 'Location Details',
      description: 'Comprehensive neighborhood information and nearby amenities.'
    },
    {
      icon: 'TrendingUp',
      title: 'Market Insights',
      description: 'Stay informed with the latest market trends and pricing data.'
    },
    {
      icon: 'Shield',
      title: 'Trusted Platform',
      description: 'Verified listings from reputable agents and property managers.'
    }
  ]

  const stats = [
    { number: '10,000+', label: 'Properties Listed' },
    { number: '5,000+', label: 'Happy Customers' },
    { number: '500+', label: 'Partner Agents' },
    { number: '50+', label: 'Cities Covered' }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
            About PropView
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're revolutionizing real estate discovery by making it easier than ever to find, 
            explore, and connect with your perfect property. Our platform combines cutting-edge 
            technology with intuitive design to create the ultimate home-hunting experience.
          </p>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-primary text-white rounded-2xl p-8 md:p-12 mb-16 text-center"
        >
          <h2 className="text-3xl font-display font-bold mb-4">
            Our Mission
          </h2>
          <p className="text-xl text-primary-100 max-w-4xl mx-auto">
            To empower everyone to find their dream home by providing the most comprehensive, 
            user-friendly, and trustworthy real estate platform. We believe that finding the 
            perfect property should be exciting, not overwhelming.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-display font-bold text-center text-gray-900 mb-12">
            Why Choose PropView?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
              >
                <Card className="p-6 h-full text-center hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ApperIcon name={feature.icon} className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-6">
            Built by Real Estate Experts
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Our team combines decades of real estate experience with modern technology expertise. 
            We understand both the challenges of property search and the power of great design 
            to solve them.
          </p>
          <div className="bg-gray-50 rounded-2xl p-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="w-20 h-20 bg-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
                  <ApperIcon name="Users" className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Real Estate Professionals</h3>
                <p className="text-sm text-gray-600">Licensed agents and brokers</p>
              </div>
              <div>
                <div className="w-20 h-20 bg-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                  <ApperIcon name="Code" className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Technology Experts</h3>
                <p className="text-sm text-gray-600">Experienced developers and designers</p>
              </div>
              <div>
                <div className="w-20 h-20 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                  <ApperIcon name="Target" className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">User Experience Focus</h3>
                <p className="text-sm text-gray-600">Dedicated to intuitive design</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 md:p-12 text-center text-white"
        >
          <h2 className="text-3xl font-display font-bold mb-4">
            Ready to Find Your Dream Home?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied users who have found their perfect property with PropView. 
            Start your search today and discover why we're the preferred choice for home hunters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="accent"
              size="lg"
              onClick={() => window.location.href = '/search'}
              icon="Search"
            >
              Start Searching
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-primary"
              icon="Heart"
            >
              View Saved Properties
            </Button>
          </div>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Questions? We're Here to Help
          </h3>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-gray-600">
            <div className="flex items-center">
              <ApperIcon name="Mail" className="w-5 h-5 mr-2" />
              <span>hello@propview.com</span>
            </div>
            <div className="flex items-center">
              <ApperIcon name="Phone" className="w-5 h-5 mr-2" />
              <span>1-800-PROPVIEW</span>
            </div>
            <div className="flex items-center">
              <ApperIcon name="MessageCircle" className="w-5 h-5 mr-2" />
              <span>Live Chat Available</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}