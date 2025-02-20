import * as productsC from"../controller/productsController.js"
import expess from "express" 
const router = expess.Router()

router.get('/products',productsC.getAllProducts)
router.get('/products/ten',productsC.getTenProducts)
router.post('/products',productsC.postProduct)
router.get('/products/:id',productsC.getProductsById)
router.get('/products/search/:id',productsC.getSearchProduct)
router.get('/products/brands/:id',productsC.getProductsByBrandId)
router.put('/products/:id',productsC.putProducts)
router.delete('/products/:id',productsC.delProdect)

export default router