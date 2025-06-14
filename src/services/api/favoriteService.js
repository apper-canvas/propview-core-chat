const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class FavoriteService {
  constructor() {
    // Load favorites from localStorage or initialize empty array
    this.favorites = JSON.parse(localStorage.getItem('propview_favorites') || '[]');
  }

  // Save to localStorage
  saveFavorites() {
    localStorage.setItem('propview_favorites', JSON.stringify(this.favorites));
  }

  async getAll() {
    await delay(200);
    return [...this.favorites];
  }

  async getById(id) {
    await delay(100);
    const favorite = this.favorites.find(f => f.propertyId === id);
    if (!favorite) {
      throw new Error('Favorite not found');
    }
    return { ...favorite };
  }

  async add(propertyId) {
    await delay(200);
    
    // Check if already favorited
    const existingIndex = this.favorites.findIndex(f => f.propertyId === propertyId);
    if (existingIndex !== -1) {
      throw new Error('Property already in favorites');
    }

    const newFavorite = {
      propertyId,
      addedDate: new Date().toISOString()
    };

    this.favorites.push(newFavorite);
    this.saveFavorites();
    return { ...newFavorite };
  }

  async remove(propertyId) {
    await delay(200);
    
    const index = this.favorites.findIndex(f => f.propertyId === propertyId);
    if (index === -1) {
      throw new Error('Favorite not found');
    }

    const removed = this.favorites.splice(index, 1)[0];
    this.saveFavorites();
    return { ...removed };
  }

  async isFavorite(propertyId) {
    await delay(50);
    return this.favorites.some(f => f.propertyId === propertyId);
  }

  // Sync method for immediate UI feedback
  isFavoriteSync(propertyId) {
    return this.favorites.some(f => f.propertyId === propertyId);
  }

  async create(favorite) {
    return this.add(favorite.propertyId);
  }

  async update(id, updates) {
    await delay(200);
    const index = this.favorites.findIndex(f => f.propertyId === id);
    if (index === -1) {
      throw new Error('Favorite not found');
    }
    this.favorites[index] = { ...this.favorites[index], ...updates };
    this.saveFavorites();
    return { ...this.favorites[index] };
  }

  async delete(propertyId) {
    return this.remove(propertyId);
  }
}

export default new FavoriteService();