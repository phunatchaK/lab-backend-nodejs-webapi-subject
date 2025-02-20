import database from "../service/database.js";

export async function getAllProducts(req, res) {
  console.log("Get all products");
  try {
    const strQuery = `SELECT p.*,(SELECT row_to_json(brand_obj) FROM (SELECT "brandId","brandName" FROM brands WHERE "brandId" = p."brandId")brand_obj) AS brand ,
    (SELECT row_to_json(pdt_obj)FROM (SELECT "pdTypeId","pdTypeName" FROM "pdTypes" WHERE "pdTypeId" = p."pdTypeId")pdt_obj) AS pdt
     FROM products p`;
    const resutl = await database.query(strQuery);
    return res.status(200).json(resutl.rows);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
export async function getTenProducts(req, res) {
  console.log("Get /getTenProducts");
  try {
    const strQuery = `SELECT p.*,(SELECT row_to_json(brand_obj) FROM (SELECT "brandId","brandName" FROM brands WHERE "brandId" = p."brandId")brand_obj) AS brand ,
    (SELECT row_to_json(pdt_obj)FROM (SELECT "pdTypeId","pdTypeName" FROM "pdTypes" WHERE "pdTypeId" = p."pdTypeId")pdt_obj) AS pdt
     FROM products p LIMIT 3`;
    const resutl = await database.query(strQuery);
    return res.status(200).json(resutl.rows);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
export async function getSearchProduct(req, res) {
  console.log("Get /getSearchProduct");
  try {
    const strQuery = `SELECT p.*,(SELECT row_to_json(brand_obj) FROM (SELECT "brandId","brandName" FROM brands WHERE "brandId" = p."brandId")brand_obj) AS brand ,
    (SELECT row_to_json(pdt_obj)FROM (SELECT "pdTypeId","pdTypeName" FROM "pdTypes" WHERE "pdTypeId" = p."pdTypeId")pdt_obj) AS pdt
     FROM products p WHERE ( p."pdId" ILIKE $1 OR p."pdName" ILIKE $1 OR p."pdRemark" ILIKE $1)`;
    const resutl = await database.query({
      text: strQuery,
      values: [`%${req.params.id}%`],
    });
    return res.status(200).json(resutl.rows);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
export async function postProduct(req, res) {
  console.log(`Post /products has req`);
  console.log(req.body);
  const bodyData = req.body;
  try {
    if (req.body.pdId == null || req.body.pdName == null) {
      return res.status(422).json({ error: `pdId and pdName is req` });
    }
    const existRowResult = await database.query({
      text: `SELECT EXISTS(SELECT * FROM products WHERE "pdId" = $1)`,
      values: [req.body.pdId],
    });
    if (existRowResult.rows[0].exists) {
      return res.status(409).json({ error: `pdId ${req.body.pdId} is exists` });
    }

    const result = await database.query({
      text: `INSERT INTO products("pdId" , "pdName","pdPrice","pdTypeId","brandId") VALUES ($1,$2,$3,$4,$5)`,
      values: [
        req.body.pdId,
        req.body.pdName,
        req.body.pdPrice,
        req.body.pdTypeId,
        req.body.brandId,
      ],
    });

    const datetime = new Date();
    bodyData.createDate = datetime;
    return res.status(201).json(bodyData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function getProductsById(req, res) {
  try {
    const result = await database.query({
      text: `SELECT p.*,(SELECT row_to_json(brand_obj) FROM (SELECT "brandId","brandName" FROM brands WHERE "brandId" = p."brandId")brand_obj) AS brand ,
      (SELECT row_to_json(pdt_obj) FROM (SELECT "pdTypeId","pdTypeName" FROM "pdTypes" 
      WHERE "pdTypeId" = p."pdTypeId") pdt_obj) AS pdt FROM products p
      WHERE p."pdId"=$1`,
      values: [req.params.id],
    });
    if (result.rowCount == 0) {
      return res.status(404).json({ error: `id ${req.params.id} not found` });
    }
    return res.status(200).json(result.rows);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function putProducts(req, res) {
  try {
    const result = await database.query({
      text: `UPDATE "products" SET "pdName"=$1,"pdPrice" =$2,"pdRemark" =$3,"pdTypeId"=$4 ,"brandId"=$5 WHERE "pdId" = $6`,
      values: [
        req.body.pdName,
        req.body.pdPrice,
        req.body.pdRemark,
        req.body.pdTypeId,
        req.body.brandId,
        req.params.id,
      ],
    });
    if (result.rowCount == 0) {
      return res.status(404).json({ error: `id ${req.params.id} not found` });
    }
    const bodyData = req.body;
    const datetime = new Date();
    bodyData.updateDate = datetime;
    return res.status(201).json(bodyData);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function delProdect(req, res) {
  try {
    const result = await database.query({
      text: `DELETE FROM products WHERE "pdId" =$1`,
      values: [req.params.id],
    });
    if (result.rowCount == 0) {
      return res.status(404).json({ error: `id ${req.params.id} not found` });
    }
    return res
      .status(204)
      .json({ message: `delete success ${result.rowCount} rows` });
  } catch (error) {
    return res.status(500).json({ error: err.message });
  }
}

export async function getProductsByBrandId(req, res) {
  try {
    const existRowResult = await database.query({
      text: `SELECT EXISTS(SELECT * FROM "brands" WHERE "brandId" ILIKE $1)`,
      values: [req.params.id],
    });
    if (!existRowResult.rows[0].exists) {
      return res
        .status(409)
        .json({ error: `brandID ${req.params.id} is not found` });
    }

    const result = await database.query({
      text: `SELECT p.*,(SELECT row_to_json(pdt_obj) FROM (SELECT * FROM "pdTypes" WHERE "pdTypeId" = p."pdTypeId")pdt_obj) AS pdt FROM products p WHERE p."brandId" ILIKE $1`,
      values: [req.params.id],
    });
    if (result.rowCount == 0) {
      return res
        .status(404)
        .json({ error: `brandID ${req.params.id} not found` });
    }
    return res.status(200).json(result.rows);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
