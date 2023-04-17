<?php

namespace Maxaboom\Models;

use Maxaboom\Models\Helpers\Database;
use datetime;
use PDO;
use PDOException;

class Product extends Database
{

    public function __construct()
    {
        parent::__construct();
        // $this->setDatabasePort(8888);
        // $this->setDatabaseUsername('root');
        // $this->setDatabasePassword('root');

        // connect to the database
        $this->dbConnect();
    }

    /**
     * Returns a product with the given `productId`
     *
     * @param int $productId id of the product
     * @return array $productData
     */
    public function getProductById(int $productId): array {
        $productData = [];

        try {

            $query = "SELECT * FROM `products` WHERE id = '$productId'";
            $pdo_stmt = $this->db->query($query, PDO::FETCH_ASSOC);

            $result = $pdo_stmt->fetch();

            // update the product data
            $productData = $result;

        } catch (PDOException $e) {
            // TODO: handle the exception
        }

        return $productData;
    }

    public function getAllProducts(){
        $allProducts = $this->db->prepare("SELECT * FROM products");
        $allProducts->execute([
        ]);
        $result = $allProducts->fetchAll(PDO::FETCH_ASSOC);
        $allProducts = $result;
        return $allProducts;
    }

    public function getAllCategories(){
        $categories = $this->db->prepare("SELECT name FROM categories");
        $categories->execute([]);
        $result = $categories->fetchAll(PDO::FETCH_ASSOC);
        $allCategories = $result;
        return $allCategories;
    }

    public function getProductsByCategoryId(int $categoryId){
        $productsCategories = $this->db->prepare("SELECT * FROM products WHERE categories_id=$categoryId");
        $productsCategories->execute([
        ]);
        $result = $productsCategories->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function getCategoryIdByName(string $categoryName){
        $selectNameCategory = $this->db->prepare("SELECT id FROM categories WHERE name = '$categoryName'");
        $selectNameCategory->execute([]);
        $result = $selectNameCategory->fetch(PDO::FETCH_ASSOC);
        return $result['id'];
    }



    public function getProductsBySubCategoryId(int $categoryId, $subCategoryId){
        $subCategorie = $this->db->prepare("SELECT * FROM products WHERE sub_categories_id=$subCategoryId AND categories_id = $categoryId");
        $subCategorie->execute([]);
        $result = $subCategorie->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }


    public function registerProduct($name,$description, $price, $categories_id, $sub_categories_id, $stock){
        $created_at = date('Y-m-d H:i:s');
        $sql = "INSERT INTO products (name, description, price, categories_id,
        sub_categories_id, created_at, stock)
                VALUES (:name, :description, :price, :categories_id, :sub_categories_id, :created_at, :stock)";
        $sql_exe = $this->db->prepare($sql);
        $sql_exe->execute([
            'name' => htmlspecialchars($name),
            'description' => htmlspecialchars($description),
            'price' => htmlspecialchars($price),
            'categories_id' => htmlspecialchars($categories_id),
            'sub_categories_id' => htmlspecialchars($sub_categories_id),
            'created_at' => $created_at,
            'stock' => htmlspecialchars($stock)
        ]);         
        if ($sql_exe) {
            echo json_encode(['response' => 'ok', 'reussite' => 'Nouveau produit enregistré']);
        } else {
            echo json_encode(['response' => 'not ok', 'echoue' => 'Problème enregistrement']);
        }
    }

    //get last id in DB for image name
    public function getLastId(){
            $getLastId = $this->db->prepare("SELECT MAX(id) FROM `products`");
            $getLastId->execute([
            ]);
            $result = $getLastId->fetchAll(PDO::FETCH_ASSOC);
            return $result[0]['MAX(id)'];        
    }

    //ADD image name with ID of the product inside
    function updateImageProduct($lastProductId){
        $sqlupdate = $this -> db -> prepare("UPDATE products SET image = 'img_$lastProductId.png' WHERE id = :id ");
        $sqlupdate->execute([
            'id' => $lastProductId,
        ]);
    }

    
    function getProductByDate(int $limit = 10){
        $allProducts = $this->db->prepare("SELECT * FROM products ORDER BY created_at DESC LIMIT $limit");
        $allProducts->execute([
        ]);
        $result = $allProducts->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    function getProductHigherPrice(int $limit = 10){
        $allProducts = $this->db->prepare("SELECT * FROM products ORDER BY price DESC LIMIT $limit");
        $allProducts->execute([
        ]);
        $result = $allProducts->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    function getProductLowerPrice(int $limit = 10){
        $allProducts = $this->db->prepare("SELECT * FROM products ORDER BY price ASC LIMIT $limit");
        $allProducts->execute([
        ]);
        $result = $allProducts->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    function deleteProductByID($productId){
        if ($this->verifDeleteProduct($productId)===NULL){
            $deleted_at = date('Y-m-d H:i:s');
            $sqlupdate = $this -> db -> prepare("UPDATE products SET deleted_at = '$deleted_at' WHERE id = :id ");
            $sqlupdate->execute([
            'id' => $productId,
        ]);
            if ($sqlupdate) {
                echo json_encode(['response' => 'ok', 'reussite' => 'Produit supprimé']);
            } 
        }else {
                echo json_encode(['response' => 'not ok', 'echoue' => 'Le produit a déjà été supprimé']);
            }

    }

    function verifDeleteProduct($Id){
        $sql = $this-> db -> prepare("SELECT deleted_at FROM products WHERE id = :id");
        $sql->execute([
            'id' => $Id
        ]);
        $results = $sql->fetch(PDO::FETCH_ASSOC); 
        return $results['deleted_at'];     
    }

}

