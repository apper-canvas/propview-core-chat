import { toast } from 'react-toastify';

class FavoriteService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'favorite';
    this.favorites = []; // Cache for sync operations
    this.initialized = false;
  }

  async initializeCache() {
    if (!this.initialized) {
      try {
        const favorites = await this.getAll();
        this.favorites = favorites;
        this.initialized = true;
      } catch (error) {
        console.error("Failed to initialize favorites cache:", error);
        this.favorites = [];
        this.initialized = true;
      }
    }
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "property_id" } },
          { field: { Name: "added_date" } }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Transform database fields to UI format
      const favorites = response.data.map(item => ({
        propertyId: item.property_id?.Id || item.property_id,
        addedDate: item.added_date
      }));

      // Update cache
      this.favorites = favorites;
      return favorites;
    } catch (error) {
      console.error("Error fetching favorites:", error);
      toast.error("Failed to load favorites");
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        where: [
          {
            FieldName: "property_id",
            Operator: "EqualTo",
            Values: [parseInt(id)]
          }
        ],
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "property_id" } },
          { field: { Name: "added_date" } }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error('Favorite not found');
      }

      if (!response.data || response.data.length === 0) {
        throw new Error('Favorite not found');
      }

      const item = response.data[0];
      return {
        propertyId: item.property_id?.Id || item.property_id,
        addedDate: item.added_date
      };
    } catch (error) {
      console.error("Error fetching favorite:", error);
      throw error;
    }
  }

  async add(propertyId) {
    try {
      // Check if already favorited
      const existing = await this.isFavorite(propertyId);
      if (existing) {
        throw new Error('Property already in favorites');
      }

      const params = {
        records: [{
          Name: `Favorite Property ${propertyId}`,
          property_id: parseInt(propertyId),
          added_date: new Date().toISOString()
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to add favorite');
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
          throw new Error('Failed to add favorite');
        }

        // Update cache
        const newFavorite = {
          propertyId: parseInt(propertyId),
          addedDate: new Date().toISOString()
        };
        this.favorites.push(newFavorite);
        
        return newFavorite;
      }
    } catch (error) {
      console.error("Error adding favorite:", error);
      throw error;
    }
  }

  async remove(propertyId) {
    try {
      // First find the record to get its ID
      const params = {
        where: [
          {
            FieldName: "property_id", 
            Operator: "EqualTo",
            Values: [parseInt(propertyId)]
          }
        ],
        fields: [
          { field: { Name: "Name" } }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success || !response.data || response.data.length === 0) {
        throw new Error('Favorite not found');
      }

      const favoriteId = response.data[0].Id;

      // Now delete the record
      const deleteParams = {
        RecordIds: [favoriteId]
      };

      const deleteResponse = await this.apperClient.deleteRecord(this.tableName, deleteParams);
      
      if (!deleteResponse.success) {
        console.error(deleteResponse.message);
        toast.error(deleteResponse.message);
        throw new Error('Failed to remove favorite');
      }

      if (deleteResponse.results) {
        const failedRecords = deleteResponse.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to remove favorite');
        }

        // Update cache
        this.favorites = this.favorites.filter(f => f.propertyId !== parseInt(propertyId));
        
        return { propertyId: parseInt(propertyId) };
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
      throw error;
    }
  }

  async isFavorite(propertyId) {
    try {
      await this.initializeCache();
      return this.favorites.some(f => f.propertyId === parseInt(propertyId));
    } catch (error) {
      console.error("Error checking favorite:", error);
      return false;
    }
  }

  // Sync method for immediate UI feedback
  isFavoriteSync(propertyId) {
    return this.favorites.some(f => f.propertyId === parseInt(propertyId));
  }

  async create(favorite) {
    return this.add(favorite.propertyId);
  }

  async update(id, updates) {
    try {
      // Find the favorite record first
      const params = {
        where: [
          {
            FieldName: "property_id",
            Operator: "EqualTo", 
            Values: [parseInt(id)]
          }
        ],
        fields: [
          { field: { Name: "Name" } }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success || !response.data || response.data.length === 0) {
        throw new Error('Favorite not found');
      }

      const favoriteId = response.data[0].Id;

      const updateData = {
        Id: favoriteId
      };

      // Only include updateable fields
      if (updates.added_date !== undefined) updateData.added_date = updates.added_date;

      const updateParams = {
        records: [updateData]
      };

      const updateResponse = await this.apperClient.updateRecord(this.tableName, updateParams);
      
      if (!updateResponse.success) {
        console.error(updateResponse.message);
        toast.error(updateResponse.message);
        throw new Error('Failed to update favorite');
      }

      if (updateResponse.results) {
        const failedRecords = updateResponse.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to update favorite');
        }

        // Update cache
        const index = this.favorites.findIndex(f => f.propertyId === parseInt(id));
        if (index !== -1) {
          this.favorites[index] = { ...this.favorites[index], ...updates };
        }

        return this.favorites[index];
      }
    } catch (error) {
      console.error("Error updating favorite:", error);
      throw error;
    }
  }

  async delete(propertyId) {
    return this.remove(propertyId);
  }
}

export default new FavoriteService();