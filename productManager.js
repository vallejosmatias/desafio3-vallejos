// productManager.js
import { promises as fsPromises } from 'fs';

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
  }

  async initializeFile() {
    try {
      await fsPromises.access(this.path);
    } catch (error) {
      // Si el archivo no existe, crea uno vacío
      await fsPromises.writeFile(this.path, '[]');
    }
  }

  async addProduct(product) {
    try {
      const products = await this.getProducts();
      const newProduct = {
        id: products.length + 1,
        ...product,
      };
      products.push(newProduct);
      await fsPromises.writeFile(this.path, JSON.stringify(products, null, 2));
      return newProduct;
    } catch (error) {
      throw new Error(`Error al agregar el producto: ${error.message}`);
    }
  }

  async getProducts() {
    try {
      const data = await fsPromises.readFile(this.path, 'utf8');
      return JSON.parse(data) || [];
    } catch (error) {
      throw new Error(`Error al obtener productos: ${error.message}`);
    }
  }

  async getProductById(productId) {
    try {
      const products = await this.getProducts();
      const product = products.find(p => p.id == productId);
      if (product) {
        return product;
      } else {
        throw new Error('Producto no encontrado.');
      }
    } catch (error) {
      throw new Error(`Error al obtener el producto por ID: ${error.message}`);
    }
  }

  async updateProduct(productId, updatedFields) {
    try {
      const products = await this.getProducts();
      const index = products.findIndex(p => p.id == productId);
      if (index !== -1) {
        products[index] = { ...products[index], ...updatedFields, id: productId };
        await fsPromises.writeFile(this.path, JSON.stringify(products, null, 2));
        return products[index];
      } else {
        throw new Error('Producto no encontrado para actualizar.');
      }
    } catch (error) {
      throw new Error(`Error al actualizar el producto: ${error.message}`);
    }
  }

  async deleteProduct(productId) {
    try {
      let products = await this.getProducts();
      const index = products.findIndex(p => p.id == productId);
      if (index !== -1) {
        products.splice(index, 1);
        await fsPromises.writeFile(this.path, JSON.stringify(products, null, 2));
      } else {
        throw new Error('Producto no encontrado para eliminar.');
      }
    } catch (error) {
      throw new Error(`Error al eliminar el producto: ${error.message}`);
    }
  }
}

export default ProductManager;
