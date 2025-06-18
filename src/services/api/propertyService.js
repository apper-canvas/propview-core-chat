import { toast } from 'react-toastify';

class PropertyService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'property';
  }

  async getAll(filters = {}) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "price" } },
          { field: { Name: "address" } },
          { field: { Name: "bedrooms" } },
          { field: { Name: "bathrooms" } },
          { field: { Name: "sqft" } },
          { field: { Name: "property_type" } },
          { field: { Name: "images" } },
          { field: { Name: "description" } },
          { field: { Name: "features" } },
          { field: { Name: "listing_date" } },
          { field: { Name: "coordinates" } }
        ],
        where: [],
        orderBy: []
      };

      // Apply filters
      if (filters.priceMin) {
        params.where.push({
          FieldName: "price",
          Operator: "GreaterThanOrEqualTo",
          Values: [filters.priceMin]
        });
      }
      if (filters.priceMax) {
        params.where.push({
          FieldName: "price",
          Operator: "LessThanOrEqualTo",
          Values: [filters.priceMax]
        });
      }
      if (filters.bedrooms) {
        params.where.push({
          FieldName: "bedrooms",
          Operator: "GreaterThanOrEqualTo",
          Values: [filters.bedrooms]
        });
      }
      if (filters.bathrooms) {
        params.where.push({
          FieldName: "bathrooms",
          Operator: "GreaterThanOrEqualTo",
          Values: [filters.bathrooms]
        });
      }
      if (filters.propertyType && filters.propertyType.length > 0) {
        params.where.push({
          FieldName: "property_type",
          Operator: "ExactMatch",
          Values: filters.propertyType
        });
      }
      if (filters.location) {
        params.where.push({
          FieldName: "address",
          Operator: "Contains",
          Values: [filters.location]
        });
      }

      // Apply sorting
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'price-low':
            params.orderBy.push({ fieldName: "price", sorttype: "ASC" });
            break;
          case 'price-high':
            params.orderBy.push({ fieldName: "price", sorttype: "DESC" });
            break;
          case 'date-new':
            params.orderBy.push({ fieldName: "listing_date", sorttype: "DESC" });
            break;
          case 'date-old':
            params.orderBy.push({ fieldName: "listing_date", sorttype: "ASC" });
            break;
          case 'size-large':
            params.orderBy.push({ fieldName: "sqft", sorttype: "DESC" });
            break;
          case 'size-small':
            params.orderBy.push({ fieldName: "sqft", sorttype: "ASC" });
            break;
        }
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Transform database fields to UI format
      const properties = response.data.map(item => ({
        id: item.Id,
        title: item.title || item.Name,
        price: item.price,
        address: item.address,
        bedrooms: item.bedrooms,
        bathrooms: item.bathrooms,
        sqft: item.sqft,
        propertyType: item.property_type,
        images: item.images ? item.images.split('\n').filter(img => img.trim()) : [],
        description: item.description,
        features: item.features ? item.features.split('\n').filter(f => f.trim()) : [],
        listingDate: item.listing_date,
        coordinates: item.coordinates ? JSON.parse(item.coordinates) : null
      }));

      return properties;
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error("Failed to load properties");
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "price" } },
          { field: { Name: "address" } },
          { field: { Name: "bedrooms" } },
          { field: { Name: "bathrooms" } },
          { field: { Name: "sqft" } },
          { field: { Name: "property_type" } },
          { field: { Name: "images" } },
          { field: { Name: "description" } },
          { field: { Name: "features" } },
          { field: { Name: "listing_date" } },
          { field: { Name: "coordinates" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Property not found');
      }

      // Transform database fields to UI format
      const item = response.data;
      return {
        id: item.Id,
        title: item.title || item.Name,
        price: item.price,
        address: item.address,
        bedrooms: item.bedrooms,
        bathrooms: item.bathrooms,
        sqft: item.sqft,
        propertyType: item.property_type,
        images: item.images ? item.images.split('\n').filter(img => img.trim()) : [],
        description: item.description,
        features: item.features ? item.features.split('\n').filter(f => f.trim()) : [],
        listingDate: item.listing_date,
        coordinates: item.coordinates ? JSON.parse(item.coordinates) : null
      };
    } catch (error) {
      console.error("Error fetching property:", error);
      toast.error("Failed to load property");
      throw error;
    }
  }

  async create(property) {
    try {
      const params = {
        records: [{
          Name: property.title,
          title: property.title,
          price: property.price,
          address: property.address,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          sqft: property.sqft,
          property_type: property.propertyType,
          images: Array.isArray(property.images) ? property.images.join('\n') : property.images,
          description: property.description,
          features: Array.isArray(property.features) ? property.features.join('\n') : property.features,
          listing_date: property.listingDate || new Date().toISOString(),
          coordinates: typeof property.coordinates === 'object' ? JSON.stringify(property.coordinates) : property.coordinates
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to create property');
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to create property');
        }

        toast.success('Property created successfully');
        return response.results[0].data;
      }
    } catch (error) {
      console.error("Error creating property:", error);
      throw error;
    }
  }

  async update(id, updates) {
    try {
      const updateData = {
        Id: parseInt(id)
      };

      // Only include updateable fields
      if (updates.title !== undefined) {
        updateData.Name = updates.title;
        updateData.title = updates.title;
      }
      if (updates.price !== undefined) updateData.price = updates.price;
      if (updates.address !== undefined) updateData.address = updates.address;
      if (updates.bedrooms !== undefined) updateData.bedrooms = updates.bedrooms;
      if (updates.bathrooms !== undefined) updateData.bathrooms = updates.bathrooms;
      if (updates.sqft !== undefined) updateData.sqft = updates.sqft;
      if (updates.propertyType !== undefined) updateData.property_type = updates.propertyType;
      if (updates.images !== undefined) {
        updateData.images = Array.isArray(updates.images) ? updates.images.join('\n') : updates.images;
      }
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.features !== undefined) {
        updateData.features = Array.isArray(updates.features) ? updates.features.join('\n') : updates.features;
      }
      if (updates.listingDate !== undefined) updateData.listing_date = updates.listingDate;
      if (updates.coordinates !== undefined) {
        updateData.coordinates = typeof updates.coordinates === 'object' ? JSON.stringify(updates.coordinates) : updates.coordinates;
      }

      const params = {
        records: [updateData]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to update property');
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to update property');
        }

        toast.success('Property updated successfully');
        return response.results[0].data;
      }
    } catch (error) {
      console.error("Error updating property:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to delete property');
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to delete property');
        }

        toast.success('Property deleted successfully');
        return true;
      }
    } catch (error) {
      console.error("Error deleting property:", error);
      throw error;
    }
  }
}

export default new PropertyService();