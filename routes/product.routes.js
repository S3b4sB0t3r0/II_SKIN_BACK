const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const productController = require("../controllers/product.controller");

/*
    ===== PRODUCT ROUTES =====
*/

// Crear producto
router.post(
  "/",
  upload.array("images", 5),   // ← cambiar
  productController.createProduct
);

// Actualizar producto
router.put(
  "/:id",
  upload.array("images", 5),   // ← cambiar
  productController.updateProduct
);

// Obtener todos
router.get("/", productController.getProducts);

// Obtener uno por ID
router.get("/:id", productController.getProductById);

// Eliminar producto (soft delete)
router.delete("/:id", productController.deleteProduct);

// Obtener productos en oferta
router.get("/sale/list", productController.getProductsOnSale);

module.exports = router;