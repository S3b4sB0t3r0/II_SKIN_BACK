const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");
const slugify = require("slugify");
const fs = require("fs");  

/*
====================================
    CREATE PRODUCT
====================================
*/
exports.createProduct = async (req, res) => {
    try {
      console.log("====== CREATE PRODUCT ======");
  
      // ===============================
      // 📸 SUBIR MÚLTIPLES IMÁGENES A CLOUDINARY
      // ===============================
      let imageUrls = [];
  
      if (req.files && req.files.length > 0) {
        console.log(`📁 Subiendo ${req.files.length} imagen(es)...`);
  
        const uploadPromises = req.files.map((file) =>
          cloudinary.uploader.upload(file.path, {
            folder: "products",
            transformation: [
              { width: 1200, height: 1200, crop: "limit" }, // redimensiona sin recortar
              { quality: "auto" },                           // optimiza calidad
              { fetch_format: "auto" }                       // convierte a webp si es posible
            ]
          })
        );
  
        const results = await Promise.all(uploadPromises);
        imageUrls = results.map((r) => r.secure_url);
  
        // 🗑️ Limpiar archivos temporales del servidor
        req.files.forEach((file) => {
          fs.unlink(file.path, (err) => {
            if (err) console.warn("⚠️ No se pudo eliminar temp:", file.path);
          });
        });
  
        console.log(`✅ ${imageUrls.length} imagen(es) subidas a Cloudinary`);
      }
  
      // ===============================
      // 🧠 PARSEAR FORMDATA
      // ===============================
      const parsedPrice = req.body.price
        ? JSON.parse(req.body.price)
        : {};
  
      const parsedVariants = req.body.variants
        ? JSON.parse(req.body.variants)
        : [];
  
      const parsedFeatures = req.body.features
        ? JSON.parse(req.body.features)
        : [];
  
      // ===============================
      // 🎯 NORMALIZAR VARIANTS
      // ===============================
      const normalizedVariants = parsedVariants.map((v, index) => ({
        color: {
          name: v.color?.name || v.color?.nombre,
          hex: v.color?.hex
        },
        size: v.size,
        stock: Number(v.stock || 0),
        sku:
          v.sku ||
          `${req.body.name.substring(0, 3).toUpperCase()}-${v.size}-${index}-${Date.now()}`
      }));
  
      // ===============================
      // 🔥 GENERAR SLUG ÚNICO
      // ===============================
      const slug =
        slugify(req.body.name, { lower: true, strict: true }) +
        "-" +
        Date.now();
  
      // ===============================
      // 💾 CREAR PRODUCTO
      // ===============================
      const product = await Product.create({
        name: req.body.name,
        slug,
        category: req.body.category,
        description: req.body.description,
        material: req.body.material,
        collection: req.body.collection,
        gender: req.body.gender,
        discountPercentage: Number(req.body.discountPercentage || 0),
        price: {
          retail: Number(parsedPrice.retail),
          wholesale: Number(parsedPrice.wholesale || 0)
        },
        features: parsedFeatures,
        variants: normalizedVariants,
        images: imageUrls   // ✅ array con todas las URLs
      });
  
      console.log("✅ Producto creado:", product.name);
  
      res.status(201).json({
        success: true,
        data: product
      });
  
    } catch (error) {
      console.log("====== ERROR CREATE PRODUCT ======");
      console.log(error);
  
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
/*
====================================
    GET ALL PRODUCTS
====================================
*/
exports.getProducts = async (req, res) => {
    try {

        const products = await Product.find({
            isActive: true
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            total: products.length,
            data: products
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error obteniendo productos",
            error: error.message
        });
    }
};


/*
====================================
    GET PRODUCT BY ID
====================================
*/
exports.getProductById = async (req, res) => {
    try {

        const { id } = req.params;

        const product = await Product.findById(id);

        if (!product || !product.isActive) {
            return res.status(404).json({
                success: false,
                message: "Producto no encontrado"
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error buscando producto",
            error: error.message
        });
    }
};


//====================================
   // UPDATE PRODUCT
//====================================

exports.updateProduct = async (req, res) => {
  try {
    console.log("====== UPDATE PRODUCT ======");

    const { id } = req.params;

    // ===============================
    // 🧠 PARSEAR FORMDATA
    // ===============================
    const parsedPrice    = req.body.price    ? JSON.parse(req.body.price)    : undefined;
    const parsedVariants = req.body.variants ? JSON.parse(req.body.variants) : undefined;
    const parsedFeatures = req.body.features ? JSON.parse(req.body.features) : undefined;

    // ===============================
    // 🎯 NORMALIZAR VARIANTS
    // ===============================
    const normalizedVariants = parsedVariants?.map((v, index) => ({
      color: {
        name: v.color?.name || v.color?.nombre,
        hex:  v.color?.hex
      },
      size:  v.size,
      stock: Number(v.stock || 0),
      sku:
        v.sku ||
        `${req.body.name.substring(0, 3).toUpperCase()}-${v.size}-${index}-${Date.now()}`
    }));

    // ===============================
    // 📸 IMÁGENES: combinar existentes + nuevas subidas
    // ===============================
    const existingImages = req.body.existingImages
      ? JSON.parse(req.body.existingImages)
      : [];

    let finalImages;

    if (req.files && req.files.length > 0) {
      console.log(`📁 Subiendo ${req.files.length} imagen(es) nuevas...`);

      const uploadPromises = req.files.map((file) =>
        cloudinary.uploader.upload(file.path, {
          folder: "products",
          transformation: [
            { width: 1200, height: 1200, crop: "limit" },
            { quality: "auto" },
            { fetch_format: "auto" }
          ]
        })
      );

      const results = await Promise.all(uploadPromises);
      const newUrls = results.map((r) => r.secure_url);

      // 🗑️ Limpiar archivos temporales
      req.files.forEach((file) => {
        fs.unlink(file.path, (err) => {
          if (err) console.warn("⚠️ No se pudo eliminar temp:", file.path);
        });
      });

      // Combina: URLs conservadas + nuevas subidas
      finalImages = [...existingImages, ...newUrls];
      console.log(`✅ Total imágenes: ${finalImages.length} (${existingImages.length} existentes + ${newUrls.length} nuevas)`);

    } else {
      // Sin archivos nuevos — solo se guardan las URLs que el usuario conservó
      finalImages = existingImages;
      console.log(`📎 Sin imágenes nuevas, conservando ${finalImages.length} existente(s)`);
    }

    // ===============================
    // 🔧 CONSTRUIR OBJETO DE UPDATE
    // ===============================
    const updateData = {
      name:               req.body.name,
      category:           req.body.category,
      description:        req.body.description,
      material:           req.body.material,
      collection:         req.body.collection,
      gender:             req.body.gender,
      discountPercentage: Number(req.body.discountPercentage || 0),
      ...(parsedPrice && {
        price: {
          retail:    Number(parsedPrice.retail),
          wholesale: Number(parsedPrice.wholesale || 0)
        }
      }),
      ...(parsedFeatures   && { features: parsedFeatures }),
      ...(normalizedVariants && { variants: normalizedVariants }),
      images: finalImages   // ✅ siempre se actualiza (vacío = sin imágenes)
    };

    // ===============================
    // 💾 ACTUALIZAR EN BD
    // ===============================
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Producto no encontrado" });
    }

    console.log("✅ Producto actualizado:", updatedProduct.name);

    res.status(200).json({ success: true, message: "Producto actualizado", data: updatedProduct });

  } catch (error) {
    console.log("====== ERROR UPDATE PRODUCT ======");
    console.log(error.message);
    res.status(500).json({ success: false, message: "Error actualizando producto", error: error.message });
  }
};


/*
====================================
    DELETE PRODUCT (SOFT DELETE)
====================================
*/
exports.deleteProduct = async (req, res) => {
    try {

        const { id } = req.params;

        const product = await Product.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Producto no encontrado"
            });
        }

        res.status(200).json({
            success: true,
            message: "Producto eliminado correctamente"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error eliminando producto",
            error: error.message
        });
    }
};


/*
====================================
    GET PRODUCTS ON SALE
====================================
*/
exports.getProductsOnSale = async (req, res) => {
    try {

        const products = await Product.find({
            isOnSale: true,
            isActive: true
        });

        res.status(200).json({
            success: true,
            total: products.length,
            data: products
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error obteniendo ofertas",
            error: error.message
        });
    }
};