import express from 'express';
import ProductManager from '../productManager.js';
import  {fileURLToPath}  from 'url';
import  {dirname,join, resolve}  from 'path';
import path from 'path';


const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

const app = express();
const port = 3000;

//ruta absoluta
const productsFilePath = path.resolve(__dirname, "../data/products.json");

// Crear instancia de ProductManager
const productManager = new ProductManager(productsFilePath);

// Inicializar el archivo si no existe
productManager.initializeFile().catch(error => console.error(error));

// Endpoint para obtener todos los productos con límite opcional
app.get('/products', async (req, res) => {
  try {
    const limit = req.query.limit;
    const products = await productManager.getProducts();

    if (limit) {
      const limitedProducts = products.slice(0, limit);
      res.json({ products: limitedProducts });
    } else {
      res.json({ products });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para obtener un producto por ID
app.get('/products/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;
    const product = await productManager.getProductById(productId);
    res.json({ product });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
