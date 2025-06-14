import properties from '../mockData/properties.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class PropertyService {
  constructor() {
    this.properties = [...properties];
  }

  async getAll(filters = {}) {
    await delay(300);
    
    let filteredProperties = [...this.properties];

    // Apply filters
    if (filters.priceMin) {
      filteredProperties = filteredProperties.filter(p => p.price >= filters.priceMin);
    }
    if (filters.priceMax) {
      filteredProperties = filteredProperties.filter(p => p.price <= filters.priceMax);
    }
    if (filters.bedrooms) {
      filteredProperties = filteredProperties.filter(p => p.bedrooms >= filters.bedrooms);
    }
    if (filters.bathrooms) {
      filteredProperties = filteredProperties.filter(p => p.bathrooms >= filters.bathrooms);
    }
    if (filters.propertyType && filters.propertyType.length > 0) {
      filteredProperties = filteredProperties.filter(p => 
        filters.propertyType.includes(p.propertyType)
      );
    }
    if (filters.location) {
      filteredProperties = filteredProperties.filter(p => 
        p.address.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-low':
          filteredProperties.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filteredProperties.sort((a, b) => b.price - a.price);
          break;
        case 'date-new':
          filteredProperties.sort((a, b) => new Date(b.listingDate) - new Date(a.listingDate));
          break;
        case 'date-old':
          filteredProperties.sort((a, b) => new Date(a.listingDate) - new Date(b.listingDate));
          break;
        case 'size-large':
          filteredProperties.sort((a, b) => b.sqft - a.sqft);
          break;
        case 'size-small':
          filteredProperties.sort((a, b) => a.sqft - b.sqft);
          break;
        default:
          break;
      }
    }

    return filteredProperties;
  }

  async getById(id) {
    await delay(200);
    const property = this.properties.find(p => p.id === id);
    if (!property) {
      throw new Error('Property not found');
    }
    return { ...property };
  }

  async create(property) {
    await delay(300);
    const newProperty = {
      ...property,
      id: Date.now().toString(),
      listingDate: new Date().toISOString()
    };
    this.properties.push(newProperty);
    return { ...newProperty };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.properties.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Property not found');
    }
    this.properties[index] = { ...this.properties[index], ...updates };
    return { ...this.properties[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.properties.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Property not found');
    }
    const deleted = this.properties.splice(index, 1)[0];
    return { ...deleted };
  }
}

export default new PropertyService();