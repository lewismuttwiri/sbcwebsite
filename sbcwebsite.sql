-- MySQL dump 10.13  Distrib 8.0.39, for Linux (x86_64)
--
-- Host: localhost    Database: sbcwebsite
-- ------------------------------------------------------
-- Server version	8.0.39-0ubuntu0.20.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `account_emailaddress`
--

DROP TABLE IF EXISTS `account_emailaddress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account_emailaddress` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  `verified` tinyint(1) NOT NULL,
  `primary` tinyint(1) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `account_emailaddress_user_id_email_987c8728_uniq` (`user_id`,`email`),
  KEY `account_emailaddress_email_03be32b2` (`email`),
  CONSTRAINT `account_emailaddress_user_id_2c513194_fk_sbcapp_customuser_id` FOREIGN KEY (`user_id`) REFERENCES `sbcapp_customuser` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account_emailaddress`
--

LOCK TABLES `account_emailaddress` WRITE;
/*!40000 ALTER TABLE `account_emailaddress` DISABLE KEYS */;
INSERT INTO `account_emailaddress` VALUES (1,'user@example.com',0,1,2),(2,'danquake2019@gmail.com',0,1,3);
/*!40000 ALTER TABLE `account_emailaddress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `account_emailconfirmation`
--

DROP TABLE IF EXISTS `account_emailconfirmation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account_emailconfirmation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created` datetime(6) NOT NULL,
  `sent` datetime(6) DEFAULT NULL,
  `key` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_address_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key` (`key`),
  KEY `account_emailconfirm_email_address_id_5b7f8c58_fk_account_e` (`email_address_id`),
  CONSTRAINT `account_emailconfirm_email_address_id_5b7f8c58_fk_account_e` FOREIGN KEY (`email_address_id`) REFERENCES `account_emailaddress` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account_emailconfirmation`
--

LOCK TABLES `account_emailconfirmation` WRITE;
/*!40000 ALTER TABLE `account_emailconfirmation` DISABLE KEYS */;
/*!40000 ALTER TABLE `account_emailconfirmation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=137 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',2,'add_permission'),(6,'Can change permission',2,'change_permission'),(7,'Can delete permission',2,'delete_permission'),(8,'Can view permission',2,'view_permission'),(9,'Can add group',3,'add_group'),(10,'Can change group',3,'change_group'),(11,'Can delete group',3,'delete_group'),(12,'Can view group',3,'view_group'),(13,'Can add content type',4,'add_contenttype'),(14,'Can change content type',4,'change_contenttype'),(15,'Can delete content type',4,'delete_contenttype'),(16,'Can view content type',4,'view_contenttype'),(17,'Can add session',5,'add_session'),(18,'Can change session',5,'change_session'),(19,'Can delete session',5,'delete_session'),(20,'Can view session',5,'view_session'),(21,'Can add Token',6,'add_token'),(22,'Can change Token',6,'change_token'),(23,'Can delete Token',6,'delete_token'),(24,'Can view Token',6,'view_token'),(25,'Can add Token',7,'add_tokenproxy'),(26,'Can change Token',7,'change_tokenproxy'),(27,'Can delete Token',7,'delete_tokenproxy'),(28,'Can view Token',7,'view_tokenproxy'),(29,'Can add comment',8,'add_comment'),(30,'Can change comment',8,'change_comment'),(31,'Can delete comment',8,'delete_comment'),(32,'Can view comment',8,'view_comment'),(33,'Can add related image',9,'add_relatedimage'),(34,'Can change related image',9,'change_relatedimage'),(35,'Can delete related image',9,'delete_relatedimage'),(36,'Can view related image',9,'view_relatedimage'),(37,'Can add Media',10,'add_media'),(38,'Can change Media',10,'change_media'),(39,'Can delete Media',10,'delete_media'),(40,'Can view Media',10,'view_media'),(41,'Can add job advertisement',11,'add_jobadvertisement'),(42,'Can change job advertisement',11,'change_jobadvertisement'),(43,'Can delete job advertisement',11,'delete_jobadvertisement'),(44,'Can view job advertisement',11,'view_jobadvertisement'),(45,'Can add job application',12,'add_jobapplication'),(46,'Can change job application',12,'change_jobapplication'),(47,'Can delete job application',12,'delete_jobapplication'),(48,'Can view job application',12,'view_jobapplication'),(49,'Can add social link',13,'add_sociallink'),(50,'Can change social link',13,'change_sociallink'),(51,'Can delete social link',13,'delete_sociallink'),(52,'Can view social link',13,'view_sociallink'),(53,'Can add tender',14,'add_tender'),(54,'Can change tender',14,'change_tender'),(55,'Can delete tender',14,'delete_tender'),(56,'Can view tender',14,'view_tender'),(57,'Can add category',15,'add_category'),(58,'Can change category',15,'change_category'),(59,'Can delete category',15,'delete_category'),(60,'Can view category',15,'view_category'),(61,'Can add product',16,'add_product'),(62,'Can change product',16,'change_product'),(63,'Can delete product',16,'delete_product'),(64,'Can view product',16,'view_product'),(65,'Can add order',17,'add_order'),(66,'Can change order',17,'change_order'),(67,'Can delete order',17,'delete_order'),(68,'Can view order',17,'view_order'),(69,'Can add cart item',18,'add_cartitem'),(70,'Can change cart item',18,'change_cartitem'),(71,'Can delete cart item',18,'delete_cartitem'),(72,'Can view cart item',18,'view_cartitem'),(73,'Can add static page',19,'add_staticpage'),(74,'Can change static page',19,'change_staticpage'),(75,'Can delete static page',19,'delete_staticpage'),(76,'Can view static page',19,'view_staticpage'),(77,'Can add user',20,'add_customuser'),(78,'Can change user',20,'change_customuser'),(79,'Can delete user',20,'delete_customuser'),(80,'Can view user',20,'view_customuser'),(81,'Can add News Article',21,'add_newsarticle'),(82,'Can change News Article',21,'change_newsarticle'),(83,'Can delete News Article',21,'delete_newsarticle'),(84,'Can view News Article',21,'view_newsarticle'),(85,'Can add Distributor Application',22,'add_partnerapplication'),(86,'Can change Distributor Application',22,'change_partnerapplication'),(87,'Can delete Distributor Application',22,'delete_partnerapplication'),(88,'Can view Distributor Application',22,'view_partnerapplication'),(89,'Can add site',23,'add_site'),(90,'Can change site',23,'change_site'),(91,'Can delete site',23,'delete_site'),(92,'Can view site',23,'view_site'),(93,'Can add email address',24,'add_emailaddress'),(94,'Can change email address',24,'change_emailaddress'),(95,'Can delete email address',24,'delete_emailaddress'),(96,'Can view email address',24,'view_emailaddress'),(97,'Can add email confirmation',25,'add_emailconfirmation'),(98,'Can change email confirmation',25,'change_emailconfirmation'),(99,'Can delete email confirmation',25,'delete_emailconfirmation'),(100,'Can view email confirmation',25,'view_emailconfirmation'),(101,'Can add social account',26,'add_socialaccount'),(102,'Can change social account',26,'change_socialaccount'),(103,'Can delete social account',26,'delete_socialaccount'),(104,'Can view social account',26,'view_socialaccount'),(105,'Can add social application',27,'add_socialapp'),(106,'Can change social application',27,'change_socialapp'),(107,'Can delete social application',27,'delete_socialapp'),(108,'Can view social application',27,'view_socialapp'),(109,'Can add social application token',28,'add_socialtoken'),(110,'Can change social application token',28,'change_socialtoken'),(111,'Can delete social application token',28,'delete_socialtoken'),(112,'Can view social application token',28,'view_socialtoken'),(113,'Can add otp',29,'add_otp'),(114,'Can change otp',29,'change_otp'),(115,'Can delete otp',29,'delete_otp'),(116,'Can view otp',29,'view_otp'),(117,'Can add product image',30,'add_productimage'),(118,'Can change product image',30,'change_productimage'),(119,'Can delete product image',30,'delete_productimage'),(120,'Can view product image',30,'view_productimage'),(121,'Can add image',31,'add_image'),(122,'Can change image',31,'change_image'),(123,'Can delete image',31,'delete_image'),(124,'Can view image',31,'view_image'),(125,'Can add order item',32,'add_orderitem'),(126,'Can change order item',32,'change_orderitem'),(127,'Can delete order item',32,'delete_orderitem'),(128,'Can view order item',32,'view_orderitem'),(129,'Can add news image',33,'add_newsimage'),(130,'Can change news image',33,'change_newsimage'),(131,'Can delete news image',33,'delete_newsimage'),(132,'Can view news image',33,'view_newsimage'),(133,'Can add Distributor Contact',34,'add_distributorcontact'),(134,'Can change Distributor Contact',34,'change_distributorcontact'),(135,'Can delete Distributor Contact',34,'delete_distributorcontact'),(136,'Can view Distributor Contact',34,'view_distributorcontact');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `authtoken_token`
--

DROP TABLE IF EXISTS `authtoken_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `authtoken_token` (
  `key` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created` datetime(6) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`key`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `authtoken_token_user_id_35299eff_fk_sbcapp_customuser_id` FOREIGN KEY (`user_id`) REFERENCES `sbcapp_customuser` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `authtoken_token`
--

LOCK TABLES `authtoken_token` WRITE;
/*!40000 ALTER TABLE `authtoken_token` DISABLE KEYS */;
INSERT INTO `authtoken_token` VALUES ('1511e2e0adb1ada7d96119036bc7d3884ec4d2bb','2025-05-22 08:18:00.576919',16),('1ddea3f74edfca6d7bd5d3807f2983b3c77560c7','2025-05-20 14:34:15.674515',8),('29de08281f72d06b4959ee21459e615462f23128','2025-05-20 15:00:12.829662',11),('3066ea6cba20650b652ee53e416ec9913332752b','2025-05-28 06:46:45.185588',21),('3c5fd150944c73558f9d40cf19bc7eafe52800a0','2025-05-22 09:20:36.126681',18),('419d57a9a9e6d3cc038282ea2633760d2b835514','2025-05-20 14:10:54.638313',7),('5e5e8ae9ca9a1de4f12e523642082d0769943ade','2025-05-27 09:17:25.060877',20),('933f41e1984ecdd752f68682d0a91f35b1d8e0a0','2025-05-20 13:00:52.896221',5),('a274c59b391366810dc3fef96f4d590fb1188b0d','2025-05-20 14:57:02.912208',10),('d3ec8dce214d79873b7dc2174c8f61104001d95f','2025-05-20 12:38:43.310324',4),('d58262489ebcc2fae3a3337376004d9eaa754c37','2025-05-20 12:10:01.591732',3),('edf4bb8909ef95ebd51d73f3b0a39ac0702973e8','2025-05-20 11:52:18.983017',2),('f8b1dec2038d3a860e0579abbc8752a8d2319b73','2025-05-21 10:50:34.419718',1);
/*!40000 ALTER TABLE `authtoken_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_comment`
--

DROP TABLE IF EXISTS `contact_comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_comment` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_comment`
--

LOCK TABLES `contact_comment` WRITE;
/*!40000 ALTER TABLE `contact_comment` DISABLE KEYS */;
INSERT INTO `contact_comment` VALUES (1,'machaa','stores','danquake2019@gmail.com','sfghjkl','adfhjkl,;wsretgyuith','2025-05-20 14:28:24.188145'),(2,'Duncan','Macharia','danquake2019@gmail.com','Brudda','Genz quant','2025-05-21 09:16:43.893003'),(3,'Duncan','Macharia','danquake2019@gmail.com','Brudda','Hello sir','2025-05-21 09:17:03.888522'),(4,'Ephraim','Onyango','ephraimnorbat@gmail.com','Hello','My LinkedIn','2025-05-22 15:41:17.202757'),(5,'Ephraim','Onyango','ephraimnorbat@gmail.com','Hello','Have you had the money','2025-05-22 15:55:53.249530'),(6,'machaa','stores','danquake2019@gmail.com','HELLO','// Types\nexport interface ProductImage {\n  src: string;\n  alt: string;\n}\n\nexport interface Brand {\n  id: string;\n  name: string;\n  description?: string;\n  logo?: string;\n}\n\nexport interface Product {\n  id: string;\n  brand: string;\n  brandId: string;\n  brandDescription: string;\n  name: string;\n  images: ProductImage[];\n  quantity: string;\n  price: number;\n  description: string;\n  slug: string;\n}\n\nconst API_URL = process.env.NEXT_PUBLIC_API_URL;\nif (!API_URL) {\n  console.error(\"NEXT_PUBLIC_API_URL is not defined in environment variables\");\n}\n\n// Cache for API responses\n// const cache: Record<string, any> = {};\n\nexport async function getAllProducts(): Promise<Product[]> {\n  const url = `${API_URL}store/api/products/`;\n  console.log(\"Fetching products from:\", url);\n  try {\n    const response = await fetch(url, {\n      method: \"GET\",\n      headers: {\n        Accept: \"application/json\",\n        \"Content-Type\": \"application/json\",\n      },\n      mode: \"cors\", // Explicitly enable CORS\n      credentials: \"include\", // Include credentials if needed\n    });\n    if (!response.ok) {\n      throw new Error(\"Failed to fetch products\");\n    }\n    const data = await response.json();\n    console.log(\"data\", data);\n    // if (cache[\"products\"]) {\n    //   return cache[\"products\"];\n    // }\n    // cache[\"products\"] = data;\n    return data as Product[];\n  } catch (error) {\n    console.error(\"Error fetching products:\", error);\n    return [];\n  }\n}\n\nexport async function getFeaturedProducts(count: number): Promise<Product[]> {\n  const url = `${API_URL}store/api/products/`;\n  console.log(\"Fetching featured products from:\", url);\n\n  try {\n    const response = await getAllProducts();\n\n    console.log(\"Products Response\", response);\n\n    return response.slice(0, count);\n  } catch (error) {\n    console.error(\"Error fetching products:\", error);\n    return [];\n  }\n}\n\nexport async function getProductsByBrandId(\n  brandId: string,\n  searchTerm: string = \"\"\n): Promise<Product[]> {\n  const url = `${API_URL}store/api/products/`;\n  console.log(\"Fetching products by brand from:\", url);\n  try {\n    const response = await fetch(url, {\n      method: \"GET\",\n      headers: {\n        Accept: \"application/json\",\n        \"Content-Type\": \"application/json\",\n      },\n      mode: \"cors\",\n      credentials: \"include\",\n    });\n\n    // Clone the response to read it multiple times if needed\n    const responseText = await response.text();\n\n    if (!response.ok) {\n      throw new Error(\n        `Failed to fetch products for brand ${brandId}: ${response.status} ${response.statusText}`\n      );\n    }\n\n    // Parse the response text as JSON\n    try {\n      const data = JSON.parse(responseText);\n      console.log(\"Parsed response data:\", data);\n\n      // First filter by brand ID\n      const brandFilteredProducts = data.filter(\n        (product: Product) =>\n          product.brand.toLowerCase() === brandId.toLowerCase()\n      );\n\n      // Then apply search term filter if provided\n      if (searchTerm && searchTerm.trim() !== \"\") {\n        const searchTermLower = searchTerm.toLowerCase().trim();\n        const searchFilteredProducts = brandFilteredProducts.filter(\n          (product: Product) => {\n            const nameMatch = product.name\n              .toLowerCase()\n              .includes(searchTermLower);\n            const descriptionMatch = product.description\n              ? product.description.toLowerCase().includes(searchTermLower)\n              : false;\n\n            return nameMatch || descriptionMatch;\n          }\n        );\n\n        return searchFilteredProducts;\n      }\n\n      return brandFilteredProducts;\n    } catch (parseError) {\n      console.error(\"Failed to parse JSON response:\", parseError);\n      console.error(\"Response text that failed to parse:\", responseText);\n      throw new Error(\"Invalid JSON response from server\");\n    }\n  } catch (error) {\n    console.error(`Error fetching products for brand ${brandId}:`, error);\n    return [];\n  }\n}\n\nexport async function getBrands() {\n  try {\n    const url = `${API_URL}store/api/categories/`;\n    console.log(\"Fetching brands from:\", url);\n    const response = await fetch(url, {\n      method: \"GET\",\n      headers: {\n        Accept: \"application/json\",\n        \"Content-Type\": \"application/json\",\n        // \"ngrok-skip-browser-warning\": \"true\", // This helps with ngrok\'s browser warning\n      },\n      mode: \"cors\", // Explicitly enable CORS\n      credentials: \"include\", // Include credentials if needed\n    });\n    if (!response.ok) {\n      throw new Error(\"Failed to fetch brands\");\n    }\n    const data = await response.json();\n    console.log(\"data brands\", data.results);\n    return data.results;\n  } catch (error) {\n    console.error(\"Error fetching brands:\", error);\n    return [];\n  }\n}\n\nexport const getProductBySlug = async (slug: string) => {\n  try {\n    const url = `${process.env.NEXT_PUBLIC_API_URL}store/api/products/${slug}/`;\n    console.log(\"Fetching product by slug from:\", url);\n\n    const response = await fetch(url, {\n      method: \"GET\",\n      headers: {\n        Accept: \"application/json\",\n        \"Content-Type\": \"application/json\",\n      },\n      mode: \"cors\",\n      credentials: \"include\",\n    });\n\n    if (!response.ok) {\n      throw new Error(`Failed to fetch product with slug ${slug}`);\n    }\n\n    const product = await response.json();\n    return product;\n  } catch (error) {\n    console.error(`Error fetching product with slug ${slug}:`, error);\n    return null;\n  }\n};','2025-05-23 10:32:43.961909'),(8,'Ephraim','Norbat','ephraimnorbat@hotmail.com','Enquiry','Hello,we are testing if the contact form sends data to sbc email','2025-05-26 10:53:43.498883'),(9,'Ephraim','Norbat','ephraimnorbat@hotmail.com','Enquiry','Hello','2025-05-26 11:02:28.558452'),(10,'Ephraim','Norbat','ephraimnorbat@gmail.com','Enquiry','Hi this is a test mail','2025-05-26 11:05:42.535233'),(11,'Ephraim','Norbat','ephraimnorbat@gmail.com','Enquiry','Hi check if contacts get to the mail viva','2025-05-26 11:12:20.199460'),(12,'Ephraim','Norbat','ephraimnorbat@gmail.com','Enquiry again','Hello test 3 for email receiving','2025-05-26 11:15:58.593837'),(13,'Ephraim','Norbat','ephraimnorbat@hotmail.com','Enquiry once again','Hello once again! testng','2025-05-26 11:22:08.009360'),(14,'Ephraim','Norbat','ephraimnorbat@hotmail.com','Enquiry once again','Hello test for email rec','2025-05-26 11:41:01.854526'),(15,'Ephraim','Norbat','ephraimnorbat@hotmail.com','Enquiry','Hello Test for templates','2025-05-26 12:07:35.954374'),(16,'Ephraim','Norbat','ephraimnorbat@hotmail.com','Enquiry once again','ertryui','2025-05-26 12:21:04.465906'),(17,'Ephraim','Norbat','ephraimnorbat@hotmail.com','Enquiry','ertyuiiuytre','2025-05-26 12:24:48.843664'),(18,'Ephraim','Norbat','ephraimnorbat@hotmail.com','Enquiry','iiuytriopp','2025-05-26 13:16:40.929029'),(19,'Ephraim','Norbat','ephraimnorbat@hotmail.com','Enquiry','User Test','2025-05-26 13:27:48.506875'),(20,'Duncan','Macharia','danquake2019@gmail.com','Hello sir','Was my order dispatched','2025-05-26 13:28:04.961952'),(21,'Ephraim','Norbat','ephraimnorbat@hotmail.com','Enquiry','hyjukikumu,ikm','2025-05-26 13:51:21.180770'),(22,'Ephraim','Norbat','ephraimnorbat@hotmail.com','EMAIL CHECK','WILL COMMIT FOR THE MEET','2025-05-26 13:56:41.817046'),(23,'Duncan','Macharia','danquake2019@gmail.com','Hello sir','The first one is the same as the official vibe coders meme','2025-05-26 13:58:33.722089'),(24,'Ephraim','Norbat','mestechsln@gmail.com','TEST','HELLO THERE','2025-05-26 14:07:42.576885'),(25,'Ephraim','Norbat','mestechsln@gmail.com','TEST','TEST55','2025-05-26 14:14:30.352408'),(26,'Duncan','Macharia','danquake2019@gmail.com','Hello sir','Take care of my order','2025-05-26 14:16:49.239996'),(27,'Ephraim','Norbat','mestechsln@gmail.com','TEST3','TEST56','2025-05-26 14:19:57.990475'),(28,'Duncan','Macharia','danquake2019@gmail.com','Hello sir','The team is going through the official vibe coders meme','2025-05-26 14:27:39.027117'),(29,'Ephraim','Norbat','mestechsln@gmail.com','OIUFD','JHGBHNRTN','2025-05-26 14:33:56.939097');
/*!40000 ALTER TABLE `contact_comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_distributorcontact`
--

DROP TABLE IF EXISTS `contact_distributorcontact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_distributorcontact` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `business_name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `business_type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `county` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sub_county` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `town` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` longtext COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_distributorcontact`
--

LOCK TABLES `contact_distributorcontact` WRITE;
/*!40000 ALTER TABLE `contact_distributorcontact` DISABLE KEYS */;
INSERT INTO `contact_distributorcontact` VALUES (1,'Testing','User','ephraimnorbat@gmail.com','0723127583','Mestechr','retail','Nairobi','Ruaraka','jiji','Lets wait and do what','2025-05-27 06:52:20.963324'),(2,'Duncan','Macharia','danquake2019@gmail.com','+254757738641','SBC KENYA','retail','Nairobi','Nairobi','Kawangware','This is my req','2025-05-27 07:54:55.001572'),(3,'Duncan','Macharia','danquake2019@gmail.com','+254757738641','SBC KENYA','wholesale','Nairobi','Nairobi','Nairobi','Can i get a distributor near Pangani','2025-05-27 08:14:34.676852'),(4,'Test','User','ephraimnorbat@gmail.com','07288750764','Supermarket','Retail','Nairobi','Ngong','Karen','hello,can i find a distributor at Karen?','2025-05-27 08:19:21.504679'),(5,'Test','User','ephraimnorbat@gmail.com','07288750764','Supermarket','Retail','Nairobi','Ngong','Karen','hello,can i find a distributor at Karen?','2025-05-27 08:40:04.222933'),(6,'Test','User','ephraimnorbat@gmail.com','07288750764','Supermarket','Retail','Nairobi','Ngong','Karen','hello,can i find a distributor at Karen?','2025-05-27 08:41:03.671448'),(7,'Testing','User','ephraimnorbat@gmail.com','0723127583','Mestechr','retail','Nairobi','Ruaraka','jiji','Lets wait and do what','2025-05-27 09:45:14.285585'),(8,'Testing','User','ephraimnorbat@gmail.com','0723127583','Mestech','retail','Nairobi','Ruaraka','jiji','Lets wait and do what','2025-05-27 09:54:11.432657'),(9,'Testing','User','ephraimnorbat@gmail.com','0723127583','Mestech','retail','Nairobi','Ruaraka','jiji','Lets wait and do what','2025-05-27 10:07:52.941601'),(10,'Testing','User','ephraimnorbat@gmail.com','0723127583','Mestech','retail','Nairobi','Ruaraka','jiji','Lets wait and do what','2025-05-27 10:19:03.768312'),(11,'Testing','User','ephraimnorbat@gmail.com','0723127583','Mestech','retail','Nairobi','Ruaraka','jiji','Lets wait and do what','2025-05-27 10:22:04.335560'),(12,'Testing','User','ephraimnorbat@gmail.com','0723127583','Mestech','retail','Nairobi','Ruaraka','jiji','Lets wait and do what','2025-05-27 10:36:28.291168'),(13,'Testing','User','ephraimnorbat@gmail.com','0723127583','Mestech','retail','Nairobi','Ruaraka','jiji','Lets wait and do what','2025-05-27 10:54:41.192001'),(14,'Testing','User','ephraimnorbat@gmail.com','0723127583','Mestech','retail','Nairobi','Ruaraka','jiji','Lets wait and do what','2025-05-27 10:54:45.052686'),(15,'Testing','User','ephraimnorbat@gmail.com','0723127583','Mestech','retail','Nairobi','Ruaraka','jiji','Lets wait and do what','2025-05-27 10:55:38.495520'),(16,'Testing','User','ephraimnorbat@gmail.com','0723127583','Mestech','retail','Nairobi','Ruaraka','jiji','Lets wait and do what','2025-05-27 10:58:01.097258'),(17,'Testing','User','ephraimnorbat@gmail.com','0723127583','Mestech','retail','Nairobi','Ruaraka','jiji','Lets wait and do what','2025-05-27 11:46:01.042607'),(18,'Testing','User','ephraimnorbat@gmail.com','0723127583','Mestech','retail','Nairobi','Ruaraka','jiji','Lets wait and do what','2025-05-27 11:55:00.148469'),(19,'Testing','User','ephraimnorbat@gmail.com','0723127583','Mestech','retail','Nairobi','Ruaraka','jiji','Lets wait and do what','2025-05-27 11:57:19.309497'),(20,'Testing','User','ephraimnorbat@gmail.com','0723127583','Mestech','retail','Nairobi','Ruaraka','jiji','Lets wait and do what','2025-05-27 12:04:53.119410'),(21,'ephra','ephra','ephraimnorbat@gmail.com','0712345678','mestch','Retail','Jiji','Nairobi','Nairobi','Hello','2025-05-27 13:23:15.551669'),(22,'ephra','ephra','ephraimnorbat@gmail.com','0712345678','mestch','Retail','Jiji','Nairobi','Nairobi','Hello','2025-05-27 13:52:26.494982'),(23,'ephra','ephra','ephraimnorbat@gmail.com','0712345678','mestch','Retail','Jiji','Nairobi','Nairobi','Hello','2025-05-27 13:55:19.837299');
/*!40000 ALTER TABLE `contact_distributorcontact` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext COLLATE utf8mb4_unicode_ci,
  `object_repr` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_sbcapp_customuser_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_sbcapp_customuser_id` FOREIGN KEY (`user_id`) REFERENCES `sbcapp_customuser` (`id`),
  CONSTRAINT `django_admin_log_chk_1` CHECK ((`action_flag` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=244 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
INSERT INTO `django_admin_log` VALUES (1,'2025-05-20 12:56:30.398352','2','user1@example.com',2,'[{\"changed\": {\"fields\": [\"Email address\"]}}]',20,1),(2,'2025-05-20 12:58:07.804219','4','user2@example.com',2,'[{\"changed\": {\"fields\": [\"Email address\"]}}]',20,1),(3,'2025-05-20 12:58:14.874449','2','user@example.com',2,'[{\"changed\": {\"fields\": [\"Email address\"]}}]',20,1),(4,'2025-05-20 13:28:40.832726','3','danquake12019@gmail.com',2,'[{\"changed\": {\"fields\": [\"Email\"]}}]',20,1),(5,'2025-05-20 14:39:34.959503','6','danquake2019@gmail.com',3,'',20,1),(6,'2025-05-20 14:48:32.052730','9','danquake2019@gmail.com',3,'',20,1),(7,'2025-05-20 15:21:11.791046','1','Pepsi',1,'[{\"added\": {}}]',15,1),(8,'2025-05-20 15:21:37.599120','1','Pepsi',1,'[{\"added\": {}}]',16,1),(9,'2025-05-20 15:58:00.635411','1','testinguser user1 - Pending',1,'[{\"added\": {}}]',22,1),(10,'2025-05-20 15:59:44.479445','13','officialdevduncan@gmail.com',3,'',20,1),(11,'2025-05-20 16:20:17.775561','2','Pepsi 300ml',1,'[{\"added\": {}}]',16,1),(12,'2025-05-21 06:55:21.318037','2','Pepsi 300 ml',2,'[{\"changed\": {\"fields\": [\"Name\", \"Slug\", \"Quantity\"]}}]',16,1),(13,'2025-05-21 06:55:37.973039','1','Pepsi',2,'[{\"changed\": {\"fields\": [\"Slug\", \"Quantity\"]}}]',16,1),(14,'2025-05-21 07:28:31.755419','2','Mirinda',1,'[{\"added\": {}}]',15,1),(15,'2025-05-21 07:29:32.642660','3','Mirinda 300ml',1,'[{\"added\": {}}]',16,1),(16,'2025-05-21 08:30:32.093071','1','pepsi 300ml',1,'[{\"added\": {}}]',31,1),(17,'2025-05-21 08:30:49.102987','2','mirinda 2l',1,'[{\"added\": {}}]',31,1),(18,'2025-05-21 08:31:17.218968','2','Mirinda',2,'[{\"changed\": {\"fields\": [\"Images\"]}}]',15,1),(19,'2025-05-21 08:32:31.716974','1','pepsi 300ml',3,'',31,1),(20,'2025-05-21 08:33:14.968891','3','mountian dew 500ml',1,'[{\"added\": {}}]',31,1),(21,'2025-05-21 08:33:38.961127','4','mirinda 500ml',1,'[{\"added\": {}}]',31,1),(22,'2025-05-21 08:34:26.228799','5','mirinda green apple 350ml',1,'[{\"added\": {}}]',31,1),(23,'2025-05-21 08:36:45.417055','6','mirinda orange 300ml',1,'[{\"added\": {}}]',31,1),(24,'2025-05-21 08:38:36.443009','1','Image for 2 products',2,'[{\"changed\": {\"fields\": [\"Products\", \"Alt text\"]}}]',30,1),(25,'2025-05-21 08:38:51.097082','2','Pepsi 300 ml',2,'[]',16,1),(26,'2025-05-21 08:38:59.627682','3','Mirinda 300ml',2,'[{\"added\": {\"name\": \"productimage-product relationship\", \"object\": \"ProductImage_products object (3)\"}}]',16,1),(27,'2025-05-21 08:39:04.782536','1','Pepsi',2,'[]',16,1),(28,'2025-05-21 08:43:54.281324','7','7up 2l',1,'[{\"added\": {}}]',31,1),(29,'2025-05-21 08:45:22.721823','8','pepsi-2l',1,'[{\"added\": {}}]',31,1),(30,'2025-05-21 08:45:38.714134','9','pepsi-500ml',1,'[{\"added\": {}}]',31,1),(31,'2025-05-21 08:48:12.783976','10','sting-red',1,'[{\"added\": {}}]',31,1),(32,'2025-05-21 08:49:34.799479','2','mirinda green apple 2l',2,'[{\"changed\": {\"fields\": [\"Alt text\"]}}]',31,1),(33,'2025-05-21 08:53:47.717150','1','Image for 3 products',3,'',30,1),(34,'2025-05-21 08:54:45.905278','2','Image for 2 products',1,'[{\"added\": {}}]',30,1),(35,'2025-05-21 08:56:43.661991','2','Image for 2 products',2,'[]',30,1),(36,'2025-05-21 08:57:05.037795','3','Image for Mirinda 300ml',1,'[{\"added\": {}}]',30,1),(37,'2025-05-21 08:57:25.945477','3','Mirinda 300ml',2,'[]',16,1),(38,'2025-05-21 08:59:41.323074','4','Image for Mirinda 300ml',1,'[{\"added\": {}}]',30,1),(39,'2025-05-21 09:01:57.845817','4','Pepsi 500ml',1,'[{\"added\": {}}, {\"added\": {\"name\": \"productimage-product relationship\", \"object\": \"ProductImage_products object (8)\"}}]',16,1),(40,'2025-05-21 09:02:58.391896','2','Image for Pepsi 500ml',2,'[{\"changed\": {\"fields\": [\"Products\", \"Image\", \"Alt text\"]}}]',30,1),(41,'2025-05-21 09:03:19.026775','4','Pepsi 500ml',2,'[]',16,1),(42,'2025-05-21 09:04:44.373684','5','Image for Pepsi 300 ml',1,'[{\"added\": {}}]',30,1),(43,'2025-05-21 09:05:39.089247','6','Image for Pepsi',1,'[{\"added\": {}}]',30,1),(44,'2025-05-21 09:06:26.253033','1','Pepsi',2,'[{\"changed\": {\"fields\": [\"Images\"]}}]',15,1),(45,'2025-05-21 09:07:00.787379','3','7up',1,'[{\"added\": {}}]',15,1),(46,'2025-05-21 09:07:39.207240','1','Pepsi',2,'[{\"changed\": {\"fields\": [\"Description\"]}}]',16,1),(47,'2025-05-21 09:07:51.802858','2','Pepsi 300 ml',2,'[{\"changed\": {\"fields\": [\"Description\"]}}]',16,1),(48,'2025-05-21 09:10:14.822673','3','Mirinda 300ml',2,'[{\"changed\": {\"fields\": [\"Description\"]}}]',16,1),(49,'2025-05-21 09:12:29.450900','1','Pepsi',2,'[{\"changed\": {\"fields\": [\"Description\"]}}]',16,1),(50,'2025-05-21 09:12:41.476532','2','Pepsi 300 ml',2,'[{\"changed\": {\"fields\": [\"Description\"]}}]',16,1),(51,'2025-05-21 09:12:57.776594','3','Mirinda 300ml',2,'[{\"changed\": {\"fields\": [\"Description\"]}}]',16,1),(52,'2025-05-21 09:14:12.671974','5','7up 2l',1,'[{\"added\": {}}]',16,1),(53,'2025-05-21 09:27:09.130483','4','Sting',1,'[{\"added\": {}}]',15,1),(54,'2025-05-21 09:28:20.766438','11','7up 500ml',1,'[{\"added\": {}}]',31,1),(55,'2025-05-21 09:33:48.868726','3','7up',2,'[{\"changed\": {\"fields\": [\"Images\"]}}]',15,1),(56,'2025-05-21 09:34:22.433320','3','7up',2,'[{\"changed\": {\"fields\": [\"Description\"]}}]',15,1),(57,'2025-05-21 09:34:47.209194','2','Mirinda',2,'[{\"changed\": {\"fields\": [\"Description\", \"Images\"]}}]',15,1),(58,'2025-05-21 09:35:27.705933','1','Pepsi',2,'[{\"changed\": {\"fields\": [\"Description\"]}}]',15,1),(59,'2025-05-21 09:37:10.623234','7','Image for 7up 2l',1,'[{\"added\": {}}]',30,1),(60,'2025-05-21 09:39:21.399012','5','Evervess',1,'[{\"added\": {}}]',15,1),(61,'2025-05-21 09:39:56.400875','6','Mountain Dew',1,'[{\"added\": {}}]',15,1),(62,'2025-05-21 09:41:08.207180','12','evervess',1,'[{\"added\": {}}]',31,1),(63,'2025-05-21 09:41:38.786804','5','Evervess',2,'[{\"changed\": {\"fields\": [\"Images\"]}}]',15,1),(64,'2025-05-21 09:42:49.408904','6','Sting',1,'[{\"added\": {}}, {\"added\": {\"name\": \"productimage-product relationship\", \"object\": \"ProductImage_products object (12)\"}}]',16,1),(65,'2025-05-21 09:43:46.853279','8','Image for Sting',1,'[{\"added\": {}}]',30,1),(66,'2025-05-21 09:44:09.529476','6','Sting',2,'[{\"changed\": {\"fields\": [\"Quantity\"]}}]',16,1),(67,'2025-05-21 09:44:29.728062','6','Sting red 330ml',2,'[{\"changed\": {\"fields\": [\"Name\"]}}, {\"deleted\": {\"name\": \"productimage-product relationship\", \"object\": \"ProductImage_products object (None)\"}}]',16,1),(68,'2025-05-21 09:46:22.990128','9','Image for Sting red 330ml',1,'[{\"added\": {}}]',30,1),(69,'2025-05-21 09:47:17.023613','7','Sting Yellow 330ml',1,'[{\"added\": {}}, {\"added\": {\"name\": \"productimage-product relationship\", \"object\": \"ProductImage_products object (15)\"}}]',16,1),(70,'2025-05-21 09:48:00.958484','7','Sting Yellow 330ml',2,'[]',16,1),(71,'2025-05-21 09:58:09.338761','1','Pepsi 2l',2,'[{\"changed\": {\"fields\": [\"Name\"]}}]',16,1),(72,'2025-05-21 10:05:27.916995','8','Evervess',1,'[{\"added\": {}}]',16,1),(73,'2025-05-21 10:11:00.202151','9','Mirinda 330ml',1,'[{\"added\": {}}]',16,1),(74,'2025-05-21 10:11:32.989138','10','Image for Evervess',1,'[{\"added\": {}}]',30,1),(75,'2025-05-21 10:12:07.251063','11','Image for Mirinda 330ml',1,'[{\"added\": {}}]',30,1),(76,'2025-05-21 10:12:46.064866','9','Mirinda 330ml',2,'[{\"added\": {\"name\": \"productimage-product relationship\", \"object\": \"ProductImage_products object (18)\"}}]',16,1),(77,'2025-05-21 10:28:57.849723','1','SBC Kenya 2025 Kicks Off with Focus on Responsible Gaming and Innovation',1,'[{\"added\": {}}]',21,1),(78,'2025-05-21 10:30:06.209872','2','Local Developers Shine at SBC Kenya 2025: A New Era for African Gaming Content',1,'[{\"added\": {}}]',21,1),(79,'2025-05-21 10:50:34.427680','1','f8b1dec2038d3a860e0579abbc8752a8d2319b73',1,'[{\"added\": {}}]',7,1),(80,'2025-05-21 12:25:08.637235','1','Order #1 - reactdev (reactdev@hotmail.com) - 500',1,'[{\"added\": {}}]',17,1),(81,'2025-05-21 12:33:51.023541','2','Order #2 - TestUser (user@example.com) - 500',1,'[{\"added\": {}}]',17,1),(82,'2025-05-21 12:40:35.237988','2','Order #2 - TestUser (user@example.com) - 500.00',3,'',17,1),(83,'2025-05-21 12:40:35.287415','1','Order #1 - reactdev (reactdev@hotmail.com) - 500.00',3,'',17,1),(84,'2025-05-21 12:43:42.547993','3','Order #3 - TestUser (user@example.com) - 10',1,'[{\"added\": {}}]',17,1),(85,'2025-05-21 12:48:20.067702','4','Order #4 - danquake2019 (danquake2019@gmail.com) - 10',1,'[{\"added\": {}}]',17,1),(86,'2025-05-21 13:19:07.361267','5','ephraimnorbat@gmail.com',2,'[{\"changed\": {\"fields\": [\"password\"]}}]',20,1),(87,'2025-05-21 13:46:00.236793','12','Order #12 - danquake2019 (danquake2019@gmail.com) - 500.00',2,'[{\"changed\": {\"fields\": [\"User\"]}}]',17,1),(88,'2025-05-21 14:07:10.582916','2','Local Developers Shine at SBC Kenya 2025: A New Era for African Gaming Content',3,'',21,1),(89,'2025-05-21 14:07:10.614872','1','SBC Kenya 2025 Kicks Off with Focus on Responsible Gaming and Innovation',3,'',21,1),(90,'2025-05-21 14:15:24.103569','3','Nairobi, Kenya – May 21, 2025 – Beyond the traditional betting giants, SBC Kenya 2025 is creating a significant platform for local game developers and tech innovators. A dedicated \"Africa Content Show',1,'[{\"added\": {}}]',21,1),(91,'2025-05-21 14:46:55.108145','1','event',1,'[{\"added\": {}}]',33,1),(92,'2025-05-21 14:47:15.586359','2','event2',1,'[{\"added\": {}}]',33,1),(93,'2025-05-21 14:47:17.123772','3','Nairobi, Kenya – May 21, 2025 – Beyond the traditional betting giants, SBC Kenya 2025 is creating a significant platform for local game developers and tech innovators. A dedicated \"Africa Content Show',2,'[{\"changed\": {\"fields\": [\"Main image\"]}}, {\"added\": {\"name\": \"newsarticle-newsimage relationship\", \"object\": \"NewsArticle_images object (1)\"}}, {\"added\": {\"name\": \"newsarticle-newsimage relationship\", \"object\": \"NewsArticle_images object (2)\"}}]',21,1),(94,'2025-05-21 14:51:22.311050','3','Nairobi, Kenya – May 21, 2025 – Beyond the traditional betting giants, SBC Kenya 2025 is creating a significant platform for local game developers and tech innovators. A dedicated \"Africa Content Show',2,'[{\"changed\": {\"fields\": [\"Category\", \"Description\", \"Content\"]}}]',21,1),(95,'2025-05-21 14:53:43.163999','3','chicken inn partnership',1,'[{\"added\": {}}]',33,1),(96,'2025-05-21 14:54:23.347097','4','chicken inn partnership 2',1,'[{\"added\": {}}]',33,1),(97,'2025-05-21 14:54:25.186434','4','Pepsi Partners with Chicken Inn',1,'[{\"added\": {}}, {\"added\": {\"name\": \"newsarticle-newsimage relationship\", \"object\": \"NewsArticle_images object (3)\"}}, {\"added\": {\"name\": \"newsarticle-newsimage relationship\", \"object\": \"NewsArticle_images object (4)\"}}]',21,1),(98,'2025-05-21 14:57:10.229732','5','happy mothers day',1,'[{\"added\": {}}]',33,1),(99,'2025-05-21 14:59:27.890216','6','happy mothers day 2',1,'[{\"added\": {}}]',33,1),(100,'2025-05-21 14:59:33.376790','5','Pepsi Wishes Happy Mother\'s Day',1,'[{\"added\": {}}, {\"added\": {\"name\": \"newsarticle-newsimage relationship\", \"object\": \"NewsArticle_images object (5)\"}}, {\"added\": {\"name\": \"newsarticle-newsimage relationship\", \"object\": \"NewsArticle_images object (6)\"}}]',21,1),(101,'2025-05-21 15:00:05.986581','3','Pepsi Partners with Quizer Club',2,'[{\"changed\": {\"fields\": [\"Title\"]}}]',21,1),(102,'2025-05-22 07:34:56.092693','12','danquake2019@gmail.com',3,'',20,1),(103,'2025-05-22 09:20:07.242080','17','danquake2019@gmail.com',3,'',20,1),(104,'2025-05-22 10:53:35.064291','15','pepeaexperience@gmail.com',2,'[{\"changed\": {\"fields\": [\"password\"]}}]',20,1),(105,'2025-05-22 10:53:48.449985','15','pepeaexperience@gmail.com',2,'[{\"changed\": {\"fields\": [\"User role\"]}}]',20,1),(106,'2025-05-22 10:55:44.315021','1','Plant Engineer',1,'[{\"added\": {}}]',11,1),(107,'2025-05-22 10:57:09.020267','1','Trust Pay - Plant Engineer',1,'[{\"added\": {}}]',12,1),(108,'2025-05-22 11:24:35.672113','11','Order #11 - usertest (usertest@gmail.com) - 800.00 - Pending',2,'[{\"changed\": {\"fields\": [\"User\"]}}]',17,1),(109,'2025-05-22 13:43:47.043875','14','Order #14 - Sbcuser (info@sbckenya.com) - 170.00 - Delivered',2,'[{\"changed\": {\"fields\": [\"Status\"]}}]',17,1),(110,'2025-05-22 14:53:26.824879','29','Order #29 - ephraimnorbat (ephraimnorbat@gmail.com) - 2400.00 - Paid',2,'[{\"changed\": {\"fields\": [\"Status\"]}}]',17,1),(111,'2025-05-26 06:52:37.247013','10','Green Apple 2 litres',1,'[{\"added\": {}}]',16,1),(112,'2025-05-26 06:53:58.967487','11','Mirinda Green Apple 500ml',1,'[{\"added\": {}}]',16,1),(113,'2025-05-26 06:56:36.474476','9','Mirinda Orange 300ml',2,'[{\"changed\": {\"fields\": [\"Name\", \"Slug\"]}}, {\"deleted\": {\"name\": \"productimage-product relationship\", \"object\": \"ProductImage_products object (None)\"}}]',16,1),(114,'2025-05-26 07:10:52.727930','9','Mirinda Green Apple 330ml',2,'[{\"changed\": {\"fields\": [\"Name\", \"Slug\"]}}]',16,1),(115,'2025-05-26 07:11:15.141214','11','Image for Mirinda Green Apple 330ml',2,'[{\"changed\": {\"fields\": [\"Alt text\"]}}]',30,1),(116,'2025-05-26 07:11:44.914710','8','Evervess 300ml',2,'[{\"changed\": {\"fields\": [\"Name\", \"Slug\"]}}]',16,1),(117,'2025-05-26 07:15:06.376151','3','Mirinda Orange 500ml',2,'[{\"changed\": {\"fields\": [\"Name\", \"Slug\"]}}]',16,1),(118,'2025-05-26 07:15:44.985962','4','Image for Mirinda Orange 500ml',2,'[{\"changed\": {\"fields\": [\"Alt text\"]}}]',30,1),(119,'2025-05-26 07:17:24.822833','12','Mirinda Orange 2litres',1,'[{\"added\": {}}]',16,1),(120,'2025-05-26 07:18:22.990099','12','Image for Mirinda Orange 2litres',1,'[{\"added\": {}}]',30,1),(121,'2025-05-26 07:28:02.478852','13','Mirinda Orange 330ml',1,'[{\"added\": {}}]',16,1),(122,'2025-05-26 07:28:41.306302','13','Image for Mirinda Orange 330ml',1,'[{\"added\": {}}]',30,1),(123,'2025-05-26 07:41:08.539002','14','Mirinda Orange 300ml',1,'[{\"added\": {}}]',16,1),(124,'2025-05-26 07:41:39.240023','14','Image for Mirinda Orange 300ml',1,'[{\"added\": {}}]',30,1),(125,'2025-05-26 07:42:59.215951','14','Image for Mirinda Orange 300ml',2,'[{\"changed\": {\"fields\": [\"Alt text\"]}}]',30,1),(126,'2025-05-26 07:43:10.986743','14','Mirinda Orange 300ml',2,'[]',16,1),(127,'2025-05-26 07:44:38.522448','15','Mirinda Green Apple 2l',1,'[{\"added\": {}}]',16,1),(128,'2025-05-26 07:45:00.688752','10','Green Apple 2 litres',3,'',16,1),(129,'2025-05-26 07:45:30.173265','15','Image for Mirinda Green Apple 2l',1,'[{\"added\": {}}]',30,1),(130,'2025-05-26 07:45:40.474953','15','Mirinda Green Apple 2l',2,'[]',16,1),(131,'2025-05-26 07:46:37.598849','16','Image for Mirinda Green Apple 2l',1,'[{\"added\": {}}]',30,1),(132,'2025-05-26 07:46:39.970126','11','Mirinda Green Apple 500ml',2,'[{\"added\": {\"name\": \"productimage-product relationship\", \"object\": \"ProductImage_products object (24)\"}}]',16,1),(133,'2025-05-26 07:48:18.670991','11','Mirinda Green Apple 500ml',2,'[{\"changed\": {\"fields\": [\"Price\", \"Quantity\"]}}]',16,1),(134,'2025-05-26 07:49:10.976435','11','Mirinda Green Apple 500ml',2,'[{\"deleted\": {\"name\": \"productimage-product relationship\", \"object\": \"ProductImage_products object (None)\"}}]',16,1),(135,'2025-05-26 07:49:56.826811','16','Image for Mirinda Green Apple 500ml',2,'[{\"changed\": {\"fields\": [\"Products\"]}}]',30,1),(136,'2025-05-26 07:52:06.908473','16','Mirinda Green Apple 330ml',1,'[{\"added\": {}}]',16,1),(137,'2025-05-26 07:52:47.955013','17','Image for Mirinda Green Apple 330ml',1,'[{\"added\": {}}]',30,1),(138,'2025-05-26 08:01:55.025652','17','Mirinda Fruity 2l',1,'[{\"added\": {}}]',16,1),(139,'2025-05-26 08:02:10.281675','17','Mirinda Fruity 2l',2,'[{\"changed\": {\"fields\": [\"Description\"]}}]',16,1),(140,'2025-05-26 08:02:47.632486','18','Mirinda Fruity 500ml',1,'[{\"added\": {}}]',16,1),(141,'2025-05-26 08:03:19.148673','19','Mirinda Fruity 330ml',1,'[{\"added\": {}}]',16,1),(142,'2025-05-26 08:05:34.750862','20','Mirinda Fruity 300ml',1,'[{\"added\": {}}]',16,1),(143,'2025-05-26 08:15:41.808757','7','Sting Gold 330ml',2,'[{\"changed\": {\"fields\": [\"Name\", \"Slug\"]}}]',16,1),(144,'2025-05-26 08:15:42.028749','7','Sting Gold 330ml',2,'[]',16,1),(145,'2025-05-26 08:23:01.339541','3','Mirinda Orange 500ml',2,'[{\"deleted\": {\"name\": \"productimage-product relationship\", \"object\": \"ProductImage_products object (None)\"}}, {\"deleted\": {\"name\": \"productimage-product relationship\", \"object\": \"ProductImage_products object (None)\"}}]',16,1),(146,'2025-05-26 08:23:28.086521','3','Image for Mirinda Orange 500ml',2,'[{\"changed\": {\"fields\": [\"Products\"]}}]',30,1),(147,'2025-05-26 08:24:38.009106','18','Image for Mirinda Fruity 2l',1,'[{\"added\": {}}]',30,1),(148,'2025-05-26 08:25:55.377812','19','Image for Mirinda Fruity 500ml',1,'[{\"added\": {}}]',30,1),(149,'2025-05-26 08:26:26.517356','20','Image for Mirinda Fruity 330ml',1,'[{\"added\": {}}]',30,1),(150,'2025-05-26 08:26:53.592231','21','Image for Mirinda Fruity 300ml',1,'[{\"added\": {}}]',30,1),(151,'2025-05-26 08:43:45.415812','21','7up 500ml',1,'[{\"added\": {}}]',16,1),(152,'2025-05-26 08:44:47.891473','22','7up 330ml',1,'[{\"added\": {}}]',16,1),(153,'2025-05-26 08:45:15.868114','21','7up 500ml',2,'[{\"changed\": {\"fields\": [\"Description\"]}}]',16,1),(154,'2025-05-26 08:45:24.401587','22','7up 330ml',2,'[{\"changed\": {\"fields\": [\"Description\"]}}]',16,1),(155,'2025-05-26 08:46:53.895532','22','Image for 7up 500ml',1,'[{\"added\": {}}]',30,1),(156,'2025-05-26 08:47:23.163508','23','Image for 7up 330ml',1,'[{\"added\": {}}]',30,1),(157,'2025-05-26 08:50:32.974010','23','Mountain Dew 2l',1,'[{\"added\": {}}]',16,1),(158,'2025-05-26 08:51:27.397207','24','Mountain Dew 500ml',1,'[{\"added\": {}}]',16,1),(159,'2025-05-26 08:52:36.206084','25','Mountain Dew 330ml',1,'[{\"added\": {}}]',16,1),(160,'2025-05-26 09:08:18.077023','26','Mirinda Pineapple 500ml',1,'[{\"added\": {}}]',16,1),(161,'2025-05-26 09:11:14.611586','27','Mirinda Pineapple 330ml',1,'[{\"added\": {}}]',16,1),(162,'2025-05-26 09:12:08.499235','28','Mirinda Pineapple 2l',1,'[{\"added\": {}}]',16,1),(163,'2025-05-26 09:13:16.758182','24','Image for Mirinda Pineapple 500ml',1,'[{\"added\": {}}]',30,1),(164,'2025-05-26 09:13:58.747093','25','Image for Mirinda Pineapple 330ml',1,'[{\"added\": {}}]',30,1),(165,'2025-05-26 09:14:28.255342','28','Mirinda Pineapple 300ml',2,'[{\"changed\": {\"fields\": [\"Name\", \"Slug\"]}}]',16,1),(166,'2025-05-26 09:15:01.621076','26','Image for Mirinda Pineapple 300ml',1,'[{\"added\": {}}]',30,1),(167,'2025-05-26 09:16:22.836033','29','Mirinda Lemon 500ml',1,'[{\"added\": {}}]',16,1),(168,'2025-05-26 09:18:14.269939','30','Mirinda Lemon 2l',1,'[{\"added\": {}}]',16,1),(169,'2025-05-26 09:22:22.243753','31','Mirinda Lemon 330ml',1,'[{\"added\": {}}]',16,1),(170,'2025-05-26 09:23:33.599294','27','Image for Mirinda Lemon 500ml',1,'[{\"added\": {}}]',30,1),(171,'2025-05-26 09:24:14.232561','28','Image for Mirinda Lemon 2l',1,'[{\"added\": {}}]',30,1),(172,'2025-05-26 09:24:53.455065','29','Image for Mirinda Lemon 330ml',1,'[{\"added\": {}}]',30,1),(173,'2025-05-26 09:31:27.306498','1','Pepsi 2l',2,'[{\"changed\": {\"fields\": [\"Price\"]}}]',16,1),(174,'2025-05-26 09:31:50.416082','2','Pepsi 300 ml',2,'[{\"changed\": {\"fields\": [\"Price\", \"Quantity\"]}}]',16,1),(175,'2025-05-26 09:32:16.601733','2','Pepsi 330 ml',2,'[{\"changed\": {\"fields\": [\"Name\", \"Slug\"]}}, {\"deleted\": {\"name\": \"productimage-product relationship\", \"object\": \"ProductImage_products object (None)\"}}]',16,1),(176,'2025-05-26 09:32:51.952243','5','Image for Pepsi 330 ml',2,'[{\"changed\": {\"fields\": [\"Products\", \"Alt text\"]}}]',30,1),(177,'2025-05-26 09:39:59.160046','30','Image for Mountain Dew 2l',1,'[{\"added\": {}}]',30,1),(178,'2025-05-26 09:41:32.202732','31','Image for Mountain Dew 500ml',1,'[{\"added\": {}}]',30,1),(179,'2025-05-26 09:41:56.392726','32','Image for Mirinda Lemon 330ml',1,'[{\"added\": {}}]',30,1),(180,'2025-05-26 09:44:28.362808','7','GDGDDG - danquake2019@gmail.com',3,'',8,1),(181,'2025-05-26 09:51:45.730956','3','Mirinda Orange 500ml',2,'[{\"changed\": {\"fields\": [\"Price\", \"Quantity\"]}}]',16,1),(182,'2025-05-26 09:52:06.617443','4','Pepsi 500ml',2,'[{\"changed\": {\"fields\": [\"Price\"]}}]',16,1),(183,'2025-05-26 09:52:34.408383','5','7up 2l',2,'[{\"changed\": {\"fields\": [\"Price\"]}}]',16,1),(184,'2025-05-26 09:53:01.253601','6','Sting red 330ml',2,'[{\"changed\": {\"fields\": [\"Price\"]}}, {\"deleted\": {\"name\": \"productimage-product relationship\", \"object\": \"ProductImage_products object (None)\"}}]',16,1),(185,'2025-05-26 09:54:20.059422','6','Sting red 330ml',2,'[{\"changed\": {\"fields\": [\"Price\"]}}]',16,1),(186,'2025-05-26 09:54:55.610345','8','Evervess 300ml',2,'[{\"changed\": {\"fields\": [\"Price\", \"Quantity\"]}}]',16,1),(187,'2025-05-26 09:55:31.023651','12','Mirinda Orange 2litres',2,'[{\"changed\": {\"fields\": [\"Price\"]}}]',16,1),(188,'2025-05-26 09:57:38.942058','9','Mirinda Green Apple 300ml',2,'[{\"changed\": {\"fields\": [\"Name\", \"Slug\", \"Price\", \"Quantity\"]}}, {\"deleted\": {\"name\": \"productimage-product relationship\", \"object\": \"ProductImage_products object (None)\"}}]',16,1),(189,'2025-05-26 09:58:29.725559','11','Image for Mirinda Green Apple 300ml',2,'[{\"changed\": {\"fields\": [\"Products\", \"Alt text\"]}}]',30,1),(190,'2025-05-26 09:59:06.763559','8','Evervess 300ml',2,'[{\"changed\": {\"fields\": [\"Price\"]}}]',16,1),(191,'2025-05-26 10:00:07.043990','2','Pepsi 330 ml',2,'[{\"changed\": {\"fields\": [\"Price\", \"Quantity\"]}}]',16,1),(192,'2025-05-26 10:09:56.290585','31','Mirinda Lemon 330ml',2,'[{\"changed\": {\"fields\": [\"Description\"]}}]',16,1),(193,'2025-05-26 10:10:04.119966','30','Mirinda Lemon 2l',2,'[{\"changed\": {\"fields\": [\"Description\"]}}]',16,1),(194,'2025-05-26 10:10:10.469171','29','Mirinda Lemon 500ml',2,'[{\"changed\": {\"fields\": [\"Description\"]}}]',16,1),(195,'2025-05-26 10:10:16.891914','28','Mirinda Pineapple 300ml',2,'[{\"changed\": {\"fields\": [\"Description\"]}}]',16,1),(196,'2025-05-26 10:10:28.153401','27','Mirinda Pineapple 330ml',2,'[{\"changed\": {\"fields\": [\"Description\"]}}]',16,1),(197,'2025-05-26 10:10:41.262822','26','Mirinda Pineapple 500ml',2,'[{\"changed\": {\"fields\": [\"Description\"]}}]',16,1),(198,'2025-05-26 10:17:06.934768','32','Image for Mountain Dew 330ml',2,'[{\"changed\": {\"fields\": [\"Products\"]}}]',30,1),(199,'2025-05-26 10:18:54.682397','13','aquafina',1,'[{\"added\": {}}]',31,1),(200,'2025-05-26 10:22:56.929053','7','Aqufina',1,'[{\"added\": {}}]',15,1),(201,'2025-05-26 10:23:31.348256','32','Aquafina',1,'[{\"added\": {}}]',16,1),(202,'2025-05-26 10:24:04.350107','32','Aquafina',2,'[{\"changed\": {\"fields\": [\"Price\"]}}]',16,1),(203,'2025-05-26 10:24:35.998949','7','Aquafina',2,'[{\"changed\": {\"fields\": [\"Name\", \"Slug\"]}}]',15,1),(204,'2025-05-26 10:24:56.655303','33','Image for Aquafina',1,'[{\"added\": {}}]',30,1),(205,'2025-05-26 10:27:03.353727','33','Evervess 330ml',1,'[{\"added\": {}}]',16,1),(206,'2025-05-26 10:27:36.152829','34','Evervess 500ml',1,'[{\"added\": {}}]',16,1),(207,'2025-05-26 10:27:43.139236','33','Evervess 330ml',2,'[{\"changed\": {\"fields\": [\"Description\"]}}]',16,1),(208,'2025-05-26 10:28:33.877660','34','Image for Evervess 330ml',1,'[{\"added\": {}}]',30,1),(209,'2025-05-26 10:28:54.199014','35','Image for Evervess 500ml',1,'[{\"added\": {}}]',30,1),(210,'2025-05-26 10:31:57.484464','35','Mountain Dew 300ml',1,'[{\"added\": {}}]',16,1),(211,'2025-05-26 10:32:44.041493','36','Image for Mountain Dew 300ml',1,'[{\"added\": {}}]',30,1),(212,'2025-05-26 10:34:03.996320','6','Sting Red 330ml',2,'[{\"changed\": {\"fields\": [\"Name\"]}}]',16,1),(213,'2025-05-26 10:59:54.396642','8','Enquiry - ephraimnorbat@hotmail.com',2,'[]',8,1),(214,'2025-05-26 13:06:52.648867','1','event',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',33,1),(215,'2025-05-26 13:07:43.794785','6','happy mothers day 2',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',33,1),(216,'2025-05-26 13:07:51.912297','5','happy mothers day',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',33,1),(217,'2025-05-26 13:07:59.313245','4','chicken inn partnership 2',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',33,1),(218,'2025-05-26 13:08:17.691667','3','chicken inn partnership',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',33,1),(219,'2025-05-26 13:10:01.015407','2','event2',2,'[{\"changed\": {\"fields\": [\"Image\"]}}]',33,1),(220,'2025-05-27 13:56:35.688931','5','Pepsi Wishes Happy Mother\'s Day',2,'[{\"changed\": {\"fields\": [\"Main image\"]}}]',21,1),(221,'2025-05-27 13:56:49.426271','5','Pepsi Wishes Happy Mother\'s Day',2,'[{\"changed\": {\"fields\": [\"Main image\"]}}]',21,1),(222,'2025-05-27 13:56:59.199136','3','Pepsi Partners with Quizer Club',2,'[{\"changed\": {\"fields\": [\"Main image\"]}}]',21,1),(223,'2025-05-27 13:57:17.898251','5','Pepsi Wishes Happy Mother\'s Day',2,'[{\"changed\": {\"fields\": [\"Main image\"]}}]',21,1),(224,'2025-05-27 13:57:46.286946','4','Pepsi Partners with Chicken Inn',2,'[{\"changed\": {\"fields\": [\"Main image\"]}}]',21,1),(225,'2025-05-27 13:57:58.336644','5','Pepsi Wishes Happy Mother\'s Day',2,'[{\"changed\": {\"fields\": [\"Main image\"]}}]',21,1),(226,'2025-05-27 13:58:42.223910','3','Pepsi Partners with Quiver Club',2,'[{\"changed\": {\"fields\": [\"Title\", \"Content\"]}}]',21,1),(227,'2025-05-27 14:07:40.356265','4','Pepsi Partners with Chicken Inn',2,'[{\"changed\": {\"fields\": [\"Main image\"]}}]',21,1),(228,'2025-05-27 14:08:06.658750','6','Sting Red 330ml',2,'[{\"changed\": {\"fields\": [\"Price\"]}}]',16,1),(229,'2025-05-27 14:08:20.856141','7','Sting Gold 330ml',2,'[{\"changed\": {\"fields\": [\"Price\"]}}]',16,1),(230,'2025-05-27 14:09:05.295162','4','Pepsi Partners with Chicken Inn',2,'[{\"changed\": {\"fields\": [\"Content\"]}}]',21,1),(231,'2025-05-27 14:09:19.669762','5','Pepsi Wishes Happy Mother\'s Day',2,'[{\"changed\": {\"fields\": [\"Content\"]}}]',21,1),(232,'2025-05-27 14:15:20.106672','37','Image for Mirinda Green Apple 300ml',1,'[{\"added\": {}}]',30,1),(233,'2025-05-27 14:16:50.353851','38','Image for Evervess 300ml',1,'[{\"added\": {}}]',30,1),(234,'2025-05-27 14:18:15.625099','39','Image for Mirinda Pineapple 300ml',1,'[{\"added\": {}}]',30,1),(235,'2025-05-27 14:18:45.470120','40','Image for Mirinda Orange 300ml',1,'[{\"added\": {}}]',30,1),(236,'2025-05-27 14:19:31.613564','41','Image for Mirinda Fruity 300ml',1,'[{\"added\": {}}]',30,1),(237,'2025-05-27 14:20:35.495344','36','Pepsi 300 ml',1,'[{\"added\": {}}]',16,1),(238,'2025-05-27 14:21:00.333940','42','Image for Pepsi 300 ml',1,'[{\"added\": {}}]',30,1),(239,'2025-05-27 14:22:20.699139','37','Mirinda Lemon 300ml',1,'[{\"added\": {}}]',16,1),(240,'2025-05-27 14:22:55.627351','43','Image for Mirinda Lemon 300ml',1,'[{\"added\": {}}]',30,1),(241,'2025-05-28 06:44:23.766441','21','',1,'[{\"added\": {}}]',20,1),(242,'2025-05-28 06:44:56.061887','21','mt1.orders@sbckenya.com',2,'[{\"changed\": {\"fields\": [\"First name\", \"Last name\", \"Email\"]}}]',20,1),(243,'2025-05-28 06:47:09.806970','21','mt.orders@sbckenya.com',2,'[{\"changed\": {\"fields\": [\"Email\"]}}]',20,1);
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (24,'account','emailaddress'),(25,'account','emailconfirmation'),(1,'admin','logentry'),(3,'auth','group'),(2,'auth','permission'),(6,'authtoken','token'),(7,'authtoken','tokenproxy'),(29,'authuser','otp'),(8,'contact','comment'),(34,'contact','distributorcontact'),(4,'contenttypes','contenttype'),(10,'gallery','media'),(9,'gallery','relatedimage'),(21,'news','newsarticle'),(33,'news','newsimage'),(22,'partner','partnerapplication'),(14,'procurement','tender'),(11,'recruitment','jobadvertisement'),(12,'recruitment','jobapplication'),(20,'sbcapp','customuser'),(19,'sbcapp','staticpage'),(5,'sessions','session'),(23,'sites','site'),(13,'social','sociallink'),(26,'socialaccount','socialaccount'),(27,'socialaccount','socialapp'),(28,'socialaccount','socialtoken'),(18,'store','cartitem'),(15,'store','category'),(31,'store','image'),(17,'store','order'),(32,'store','orderitem'),(16,'store','product'),(30,'store','productimage');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2025-05-20 10:33:28.554523'),(2,'contenttypes','0002_remove_content_type_name','2025-05-20 10:33:28.796743'),(3,'auth','0001_initial','2025-05-20 10:33:30.310111'),(4,'auth','0002_alter_permission_name_max_length','2025-05-20 10:33:30.535802'),(5,'auth','0003_alter_user_email_max_length','2025-05-20 10:33:30.559254'),(6,'auth','0004_alter_user_username_opts','2025-05-20 10:33:30.582103'),(7,'auth','0005_alter_user_last_login_null','2025-05-20 10:33:30.601799'),(8,'auth','0006_require_contenttypes_0002','2025-05-20 10:33:30.619314'),(9,'auth','0007_alter_validators_add_error_messages','2025-05-20 10:33:30.643748'),(10,'auth','0008_alter_user_username_max_length','2025-05-20 10:33:30.666865'),(11,'auth','0009_alter_user_last_name_max_length','2025-05-20 10:33:30.691131'),(12,'auth','0010_alter_group_name_max_length','2025-05-20 10:33:30.749074'),(13,'auth','0011_update_proxy_permissions','2025-05-20 10:33:30.774322'),(14,'auth','0012_alter_user_first_name_max_length','2025-05-20 10:33:30.800698'),(15,'sbcapp','0001_initial','2025-05-20 10:33:32.329533'),(16,'account','0001_initial','2025-05-20 10:33:32.851217'),(17,'account','0002_initial','2025-05-20 10:33:33.220737'),(18,'admin','0001_initial','2025-05-20 10:33:33.930832'),(19,'admin','0002_logentry_remove_auto_add','2025-05-20 10:33:33.956450'),(20,'admin','0003_logentry_add_action_flag_choices','2025-05-20 10:33:33.978028'),(21,'authtoken','0001_initial','2025-05-20 10:33:34.106112'),(22,'authtoken','0002_initial','2025-05-20 10:33:34.589556'),(23,'contact','0001_initial','2025-05-20 10:33:35.487331'),(24,'gallery','0001_initial','2025-05-20 10:33:37.096722'),(25,'news','0001_initial','2025-05-20 10:33:37.224150'),(26,'partner','0001_initial','2025-05-20 10:33:37.328438'),(27,'procurement','0001_initial','2025-05-20 10:33:37.467425'),(28,'recruitment','0001_initial','2025-05-20 10:33:37.955378'),(29,'sessions','0001_initial','2025-05-20 10:33:38.219084'),(30,'sites','0001_initial','2025-05-20 10:33:38.378864'),(31,'sites','0002_alter_domain_unique','2025-05-20 10:33:38.515107'),(32,'social','0001_initial','2025-05-20 10:33:38.686213'),(33,'socialaccount','0001_initial','2025-05-20 10:33:41.562569'),(34,'store','0001_initial','2025-05-20 10:33:43.519590'),(35,'authuser','0001_initial','2025-05-20 12:36:01.249670'),(36,'sbcapp','0002_customuser_is_verified_customuser_user_role','2025-05-20 12:36:01.989995'),(37,'sbcapp','0003_alter_customuser_email','2025-05-20 13:28:56.379849'),(38,'partner','0002_rename_full_name_partnerapplication_first_name_and_more','2025-05-20 15:49:40.557358'),(39,'partner','0003_remove_partnerapplication_business_address','2025-05-20 15:55:16.032217'),(40,'store','0002_product_quantity_product_slug_productimage','2025-05-21 06:28:52.123768'),(41,'store','0003_alter_product_image','2025-05-21 07:51:47.903499'),(42,'store','0004_image_remove_category_image_remove_product_image_and_more','2025-05-21 08:21:30.653487'),(43,'store','0005_remove_order_product_name_remove_order_quantity_and_more','2025-05-21 12:18:01.133740'),(44,'store','0006_remove_order_company_name','2025-05-21 12:42:05.201462'),(45,'news','0002_remove_newsarticle_slug_newsarticle_type','2025-05-21 14:11:12.373625'),(46,'news','0003_newsimage_rename_type_newsarticle_category_and_more','2025-05-21 14:45:43.264793'),(47,'store','0007_order_status_order_updated_at_and_more','2025-05-21 15:28:30.239537'),(48,'sbcapp','0004_alter_customuser_user_role','2025-05-22 09:50:00.526602'),(49,'sbcapp','0005_alter_customuser_user_role','2025-05-22 10:49:27.865123'),(50,'recruitment','0002_alter_jobapplication_options_and_more','2025-05-24 10:26:33.504388'),(51,'contact','0002_distributorcontact','2025-05-27 06:30:08.114182'),(52,'contact','0003_alter_distributorcontact_business_type','2025-05-27 08:09:27.479263');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `session_data` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
INSERT INTO `django_session` VALUES ('09odlffs4mogp8j4vepclmv1gjthnk5n','.eJxVjMsOgjAQRf-la9Mw9AHj0r3fQGamU0FNSSisjP-uJCx0e88592UG2tZx2Kouw5TM2QRz-t2Y5KFlB-lO5TZbmcu6TGx3xR602uuc9Hk53L-Dker4rZEcEOTGt6o-eA6YU48oKFEbyE4yaeh6FlAXozQQJXKL0HHnHEI27w_tAzfg:1uI6RZ:kf4gIaUFgC5P7N2ISMZZNpWjLkxTNivg-hzfMx-kXfA','2025-05-22 21:58:45.607051'),('0iscw911v6botx27i31xqrwjtvrwtcl0','.eJxVjDsOwjAQBe_iGlnG3w0lfc5g2btrHECOFCcV4u4QKQW0b2beS8S0rTVunZc4kbgIJ06_W0744LYDuqd2myXObV2mLHdFHrTLcSZ-Xg_376CmXr-1VoBpYACiDMpxKRYYYTDG2BKs0sp6tJAxaeUJnAmKjT5jCUjZkRfvD-VkN98:1uHO1U:4SJRNFwSuORiP9bIGLeGu6aN116Qi4bzcJGEse5Ayoc','2025-05-20 15:32:52.134507'),('12emczul85gyzyh5d88e3bd07hug4siq','.eJxVjMsOgjAQRf-la9Mw9AHj0r3fQGamU0FNSSisjP-uJCx0e88592UG2tZx2Kouw5TM2QRz-t2Y5KFlB-lO5TZbmcu6TGx3xR602uuc9Hk53L-Dker4rZEcEOTGt6o-eA6YU48oKFEbyE4yaeh6FlAXozQQJXKL0HHnHEI27w_tAzfg:1uI7sG:X9k92sWwncww8I-sm05gJYUiSO6ohFW9qYTdxD6euM0','2025-05-22 23:30:24.933313'),('16dow0ayzcyenqqvi3sgxd3bf6571twp','.eJxVjMsOgjAQRf-la9Mw9AHj0r3fQGamU0FNSSisjP-uJCx0e88592UG2tZx2Kouw5TM2QRz-t2Y5KFlB-lO5TZbmcu6TGx3xR602uuc9Hk53L-Dker4rZEcEOTGt6o-eA6YU48oKFEbyE4yaeh6FlAXozQQJXKL0HHnHEI27w_tAzfg:1uI8Dg:jY5uRAW0Yg0NdNvN-vN5iex0rIlO7jtZ07RhyBT_vrU','2025-05-22 23:52:32.104135'),('18if5udojf5z0n2j6aknihg4zk2modf1','.eJxVjDsOwjAQBe_iGlnG3w0lfc5g2btrHECOFCcV4u4QKQW0b2beS8S0rTVunZc4kbgIJ06_W0744LYDuqd2myXObV2mLHdFHrTLcSZ-Xg_376CmXr-1VoBpYACiDMpxKRYYYTDG2BKs0sp6tJAxaeUJnAmKjT5jCUjZkRfvD-VkN98:1uHOA6:aReVHms7zNZMriGhPgBGcE1_kpHFQJRW1VWBYSP4p6g','2025-05-20 15:41:46.061175'),('1fpl5kzsditf14lniiojy6dc2zn65m2o','.eJxVjEEOwiAQRe_C2pAZMlDq0r1nIAMMUjU0Ke3KeHdt0oVu_3vvv1Tgba1h67KEKauzQnX63SKnh7Qd5Du326zT3NZlinpX9EG7vs5ZnpfD_Tuo3Ou3BgPkDA2Jga0TQQ9YCIqNeSyJKBqLIHEoSFbYU0IXUUYA9Fysder9AcrGN1Q:1uIm8g:5kN9dIL4g2n-fIzpM92lji1kGQH13eRzigzkXIP9lCA','2025-05-24 18:30:02.956034'),('1ym0oi1d51xb9njsaz85bn8iyb28969h','.eJxVjEsOAiEQBe_C2hD5NIJL956BdEMjowaSYWZlvLtOMgvdvqp6LxFxXWpcB89xyuIslBaH35EwPbhtJN-x3bpMvS3zRHJT5E6HvPbMz8vu_h1UHPVbEykEW0pQ2gfQyWiNmNUJwIGz6DJ4z4YCJghHtMUpsr6gDcCWDGfx_gD9OzgK:1uHfCG:KWgYYmqpwfp3aHNPnLrAd-G_7c0HJHOThzofYrafkCA','2025-05-21 09:53:08.511221'),('203vbnc08u6yz0dct1l83o0rx69aoi62','.eJxVjDkOwjAUBe_iGll4x5T0OYPlvxgHkCPFSYW4O4mUAto3M-8tUl6XmtbOcxpJXIW6iNPvCBmf3HZCj9zuk8SpLfMIclfkQbscJuLX7XD_Dmrudat1LAqtVsWgxYLKBF9CBMbA2hFDycaxAeu0dQxnbSlGIm_NxlF5LT5fIHE4aw:1uIPye:Rf0RWHJVvYvnkXHoA5rqk5PXXLTYNzmrk_NjKvn0sRo','2025-05-23 18:50:12.428342'),('2t3ro54xt1fteta8w0qxbgy0f1yehhvw','.eJxVjEEOwiAQRe_C2pAZMlDq0r1nIAMMUjU0Ke3KeHdt0oVu_3vvv1Tgba1h67KEKauzQnX63SKnh7Qd5Du326zT3NZlinpX9EG7vs5ZnpfD_Tuo3Ou3BgPkDA2Jga0TQQ9YCIqNeSyJKBqLIHEoSFbYU0IXUUYA9Fysder9AcrGN1Q:1uHPo8:AEXVUKCW3PYMgpKgN2ah3p290ajUxiRtvx4S3AuvTcw','2025-05-20 17:27:12.819623'),('32ows246g7g5b9v8cxb6yhhc233ck7am','.eJxVjDkOwjAUBe_iGll4x5T0OYPlvxgHkCPFSYW4O4mUAto3M-8tUl6XmtbOcxpJXIW6iNPvCBmf3HZCj9zuk8SpLfMIclfkQbscJuLX7XD_Dmrudat1LAqtVsWgxYLKBF9CBMbA2hFDycaxAeu0dQxnbSlGIm_NxlF5LT5fIHE4aw:1uI5RP:fdBSTqtw6PqpkbaNVuFndD35Np40iBGIN6-UN83AjLU','2025-05-22 20:54:31.059702'),('33sv2itucoftl5pk79a2o7tqamsjc54y','.eJxVjDkOwjAUBe_iGll4x5T0OYPlvxgHkCPFSYW4O4mUAto3M-8tUl6XmtbOcxpJXIW6iNPvCBmf3HZCj9zuk8SpLfMIclfkQbscJuLX7XD_Dmrudat1LAqtVsWgxYLKBF9CBMbA2hFDycaxAeu0dQxnbSlGIm_NxlF5LT5fIHE4aw:1uI5X5:P9lphcL453TpklDX27bcUaBWYCbsBkL88QTFe3D8pAU','2025-05-22 21:00:23.408540'),('3kdxm2dokli7kbf0wxw2jlvuibuk9q5s','.eJxVjMsOgjAQRf-la9Mw9AHj0r3fQGamU0FNSSisjP-uJCx0e88592UG2tZx2Kouw5TM2QRz-t2Y5KFlB-lO5TZbmcu6TGx3xR602uuc9Hk53L-Dker4rZEcEOTGt6o-eA6YU48oKFEbyE4yaeh6FlAXozQQJXKL0HHnHEI27w_tAzfg:1uI6ck:ql91DjcQnrH3jtt77cBnX6wwPVf1ZlyXzexfYvc7vHE','2025-05-22 22:10:18.975385'),('3qy1jswc5gfrxr8x4n7880mh4szv0glt','.eJxVjDkOwjAUBe_iGll4x5T0OYPlvxgHkCPFSYW4O4mUAto3M-8tUl6XmtbOcxpJXIW6iNPvCBmf3HZCj9zuk8SpLfMIclfkQbscJuLX7XD_Dmrudat1LAqtVsWgxYLKBF9CBMbA2hFDycaxAeu0dQxnbSlGIm_NxlF5LT5fIHE4aw:1uI3pc:xXmqT0k3iW9RQk7-KmeFaA2NgzGUr7xroy9qkMgSttI','2025-05-22 19:11:24.598980'),('44qv6b6gyhhxj8axzmcjijnw9rpg7g42','.eJxVjEsOAiEQBe_C2hD5NIJL956BdEMjowaSYWZlvLtOMgvdvqp6LxFxXWpcB89xyuIslBaH35EwPbhtJN-x3bpMvS3zRHJT5E6HvPbMz8vu_h1UHPVbEykEW0pQ2gfQyWiNmNUJwIGz6DJ4z4YCJghHtMUpsr6gDcCWDGfx_gD9OzgK:1uHP4u:QLyORobc3f4GjVzm5eCpcjmlomdPWfsbBSAVbjkpIv0','2025-05-20 16:40:28.698932'),('490mt9tvlqmq3oqkimv4stll06b5n451','.eJxVjMEOgyAQRP-Fc2NEXFa8tT9CFlwiKcVEoZem_15tvHicNzPvI8j7peZi37zGEHmy_KKYxJhrSjdhqZbZ1o1XGycxCiUuzJF_cj4KSunAzalr_puz3pr7njiX6KnEJT_O10U10zbvHiO1BDSoJy8VKOZOIcjQIaIDcBicboPude8CAPuBDWgDrkOlCFoYxPcHU0JGgg:1uHLnG:WPyhRwHSpmAEPHoXmIOKmIqV1JqM6zekZEuaXWr1E_M','2025-05-20 13:10:02.713888'),('494j6y3h9npiip0yo3el0uy7q43p5k07','e30:1uKcEz:xrzSAi4j7Th6EdI8Xg0FcF33izcjAVIjqousNhVB5xQ','2025-05-29 20:20:09.883632'),('49dxm7hum2zj6yke72oe6x2wzdqtnhus','.eJxVjMsOgjAQRf-la9Mw9AHj0r3fQGamU0FNSSisjP-uJCx0e88592UG2tZx2Kouw5TM2QRz-t2Y5KFlB-lO5TZbmcu6TGx3xR602uuc9Hk53L-Dker4rZEcEOTGt6o-eA6YU48oKFEbyE4yaeh6FlAXozQQJXKL0HHnHEI27w_tAzfg:1uI7cI:ik5YsXu-j9RGhhINn4bBJxaKc7-ZwJ4mAXDwdtamREc','2025-05-22 23:13:54.737970'),('4o7xyretl9z58pjesfmab20t5ejlhdj0','.eJxVjEEOwiAQRe_C2pChQAGX7j0DGWZAqoYmpV0Z765NutDtf-_9l4i4rTVuPS9xYnEWQZx-t4T0yG0HfMd2myXNbV2mJHdFHrTL68z5eTncv4OKvX5rU2BgM2rrBlDBkDFIIyvIVAopaz0njagTgQafHVltUwiOMIAjb1i8P9m5N84:1uHODg:Y-JmF7f6wfZRQbT-MmmKIS8zpId0tGG0cz8vgCz4ILI','2025-05-20 15:45:28.957802'),('5qnw2kvej3gnnl3f8mxsn25nub2njrtn','.eJxVjDkOwjAUBe_iGll4x5T0OYPlvxgHkCPFSYW4O4mUAto3M-8tUl6XmtbOcxpJXIW6iNPvCBmf3HZCj9zuk8SpLfMIclfkQbscJuLX7XD_Dmrudat1LAqtVsWgxYLKBF9CBMbA2hFDycaxAeu0dQxnbSlGIm_NxlF5LT5fIHE4aw:1uI7XG:WJYjF-nLRpWkeV8i6c34Kie1PbuCu0Pm9iMXo_HmTdk','2025-05-22 23:08:42.815552'),('5sefefil6y2v3uol8fyx14viqv9unpza','.eJxVjMsOgjAQRf-la9Mw9AHj0r3fQGamU0FNSSisjP-uJCx0e88592UG2tZx2Kouw5TM2QRz-t2Y5KFlB-lO5TZbmcu6TGx3xR602uuc9Hk53L-Dker4rZEcEOTGt6o-eA6YU48oKFEbyE4yaeh6FlAXozQQJXKL0HHnHEI27w_tAzfg:1uI6WM:zpcTf2y8WEhXolbBPQazEFxN0k7BVLtC7iAKM9Jxu5Q','2025-05-22 22:03:42.077350'),('68g29n0ea89n80wr6jl8i01m5bxnbgkv','.eJxVjEsOAiEQBe_C2hD5NIJL956BdEMjowaSYWZlvLtOMgvdvqp6LxFxXWpcB89xyuIslBaH35EwPbhtJN-x3bpMvS3zRHJT5E6HvPbMz8vu_h1UHPVbEykEW0pQ2gfQyWiNmNUJwIGz6DJ4z4YCJghHtMUpsr6gDcCWDGfx_gD9OzgK:1uHOwL:nt7y6p1ehUzcTxF4vEWTR1IUxSOe7CjTYmDxmQupeqM','2025-05-20 16:31:37.041513'),('6p4v7fioya6asbt5i4idueechp55jvr2','.eJxVjDkOwjAUBe_iGll4x5T0OYPlvxgHkCPFSYW4O4mUAto3M-8tUl6XmtbOcxpJXIW6iNPvCBmf3HZCj9zuk8SpLfMIclfkQbscJuLX7XD_Dmrudat1LAqtVsWgxYLKBF9CBMbA2hFDycaxAeu0dQxnbSlGIm_NxlF5LT5fIHE4aw:1uIAwF:_nil2kgNsDM8dmV81hBiMXflJ2t0QupKNrtbG8Jvb2g','2025-05-23 02:46:43.669005'),('6yc1m1qevbi9uuzq9nihfobffbiulid6','.eJxVjMsOgjAQRf-la9Mw9AHj0r3fQGamU0FNSSisjP-uJCx0e88592UG2tZx2Kouw5TM2QRz-t2Y5KFlB-lO5TZbmcu6TGx3xR602uuc9Hk53L-Dker4rZEcEOTGt6o-eA6YU48oKFEbyE4yaeh6FlAXozQQJXKL0HHnHEI27w_tAzfg:1uI7Go:t9y-AvxUDzO5-ptUYbS9S9ieHkbdSoTMRA0JxOfJczg','2025-05-22 22:51:42.796939'),('6z6ot5z9nfpjo487tr31lx1nsfmlzh6p','.eJxVjDkOwjAUBe_iGll4x5T0OYPlvxgHkCPFSYW4O4mUAto3M-8tUl6XmtbOcxpJXIW6iNPvCBmf3HZCj9zuk8SpLfMIclfkQbscJuLX7XD_Dmrudat1LAqtVsWgxYLKBF9CBMbA2hFDycaxAeu0dQxnbSlGIm_NxlF5LT5fIHE4aw:1uIBbT:CUOJvAdyKJzzKto7XDhl7w706wFoVO6FuL2YOI00Udg','2025-05-23 03:29:19.606029'),('7auiws6u18hwndxihop9t0gd2eogi70s','.eJxVjDkOwjAUBe_iGll4x5T0OYPlvxgHkCPFSYW4O4mUAto3M-8tUl6XmtbOcxpJXIW6iNPvCBmf3HZCj9zuk8SpLfMIclfkQbscJuLX7XD_Dmrudat1LAqtVsWgxYLKBF9CBMbA2hFDycaxAeu0dQxnbSlGIm_NxlF5LT5fIHE4aw:1uI3IE:baPhHx1dc6Do4NPBljGk9WAFnKEecvhNwptWtZ8HWpU','2025-05-22 11:36:54.539004'),('7f07tlcni07sn2n5k1ofcygw8zdd45dz','.eJxVjDsOwjAQBe_iGlnG3w0lfc5g2btrHECOFCcV4u4QKQW0b2beS8S0rTVunZc4kbgIJ06_W0744LYDuqd2myXObV2mLHdFHrTLcSZ-Xg_376CmXr-1VoBpYACiDMpxKRYYYTDG2BKs0sp6tJAxaeUJnAmKjT5jCUjZkRfvD-VkN98:1uHOAX:RrFRyBlWQeaHOmwinrloaEuqu0RgHT89m9K0AJOBVjY','2025-05-20 15:42:13.681110'),('7n2br4hgw1i0axr616y7h7ee9t3b4upt','.eJxVjDkOwjAUBe_iGll4x5T0OYPlvxgHkCPFSYW4O4mUAto3M-8tUl6XmtbOcxpJXIW6iNPvCBmf3HZCj9zuk8SpLfMIclfkQbscJuLX7XD_Dmrudat1LAqtVsWgxYLKBF9CBMbA2hFDycaxAeu0dQxnbSlGIm_NxlF5LT5fIHE4aw:1uI5I5:arzH0BCFWUDKmRUuPz-3ooE0K2vQuDEvski2x0Nf8ms','2025-05-22 20:44:53.534811'),('7vvvmmz3pq7127zyb0r06zyjr2ojdegf','.eJxVjDkOwjAUBe_iGll4x5T0OYPlvxgHkCPFSYW4O4mUAto3M-8tUl6XmtbOcxpJXIW6iNPvCBmf3HZCj9zuk8SpLfMIclfkQbscJuLX7XD_Dmrudat1LAqtVsWgxYLKBF9CBMbA2hFDycaxAeu0dQxnbSlGIm_NxlF5LT5fIHE4aw:1uI51w:Y2KX6L1YYwUjoT0vs5ktI00K5BFvwuMDTO0gxRLNxvo','2025-05-22 20:28:12.847730'),('7w3f2i7hb4qxzxbuhqjq81val2eda35z','.eJxVjEEOwiAQRe_C2pAZMlDq0r1nIAMMUjU0Ke3KeHdt0oVu_3vvv1Tgba1h67KEKauzQnX63SKnh7Qd5Du326zT3NZlinpX9EG7vs5ZnpfD_Tuo3Ou3BgPkDA2Jga0TQQ9YCIqNeSyJKBqLIHEoSFbYU0IXUUYA9Fysder9AcrGN1Q:1uJa5k:WXfsY1xcHwN8ZfWrLS2t4NIa6wQ2jrZ_VgQs0AjVKcE','2025-05-26 23:50:20.303769'),('81bf0sdtkkacqvqv91hrox3pzca9mb5c','.eJxVjEsOAiEQBe_C2hD5NIJL956BdEMjowaSYWZlvLtOMgvdvqp6LxFxXWpcB89xyuIslBaH35EwPbhtJN-x3bpMvS3zRHJT5E6HvPbMz8vu_h1UHPVbEykEW0pQ2gfQyWiNmNUJwIGz6DJ4z4YCJghHtMUpsr6gDcCWDGfx_gD9OzgK:1uHgNo:8JZFIcdaFLTGxcO1pwuqg8RMtw1cdcSWlHnyOGtbtas','2025-05-21 11:09:08.931375'),('8sf5rg9mmacktkr9lx8nsod086ro8glh','.eJxVjDkOwjAUBe_iGll4x5T0OYPlvxgHkCPFSYW4O4mUAto3M-8tUl6XmtbOcxpJXIW6iNPvCBmf3HZCj9zuk8SpLfMIclfkQbscJuLX7XD_Dmrudat1LAqtVsWgxYLKBF9CBMbA2hFDycaxAeu0dQxnbSlGIm_NxlF5LT5fIHE4aw:1uI2Bs:jaF-isB4B9YXvIPY1jYxHuccgfIgikQtUkTjkvVS41s','2025-05-22 10:26:16.173768'),('8t2p8bqmxfcsxx4385cxi9x6tfzdt1jf','.eJxVjDkOwjAUBe_iGll4x5T0OYPlvxgHkCPFSYW4O4mUAto3M-8tUl6XmtbOcxpJXIW6iNPvCBmf3HZCj9zuk8SpLfMIclfkQbscJuLX7XD_Dmrudat1LAqtVsWgxYLKBF9CBMbA2hFDycaxAeu0dQxnbSlGIm_NxlF5LT5fIHE4aw:1uIPax:CSHMPnE-v2MY4_CcGzd4it6sSDDjk4nxGrnA6s8pwSE','2025-05-23 18:25:43.954010'),('9d8iu1jmzi52qoinm7k9ooee4e0iv8he','.eJxVjMsOgjAQRf-la9Mw9AHj0r3fQGamU0FNSSisjP-uJCx0e88592UG2tZx2Kouw5TM2QRz-t2Y5KFlB-lO5TZbmcu6TGx3xR602uuc9Hk53L-Dker4rZEcEOTGt6o-eA6YU48oKFEbyE4yaeh6FlAXozQQJXKL0HHnHEI27w_tAzfg:1uI7aO:-DpO4l6CA4ZLLMMDukZpxFuo4wS5lkFSthmx_l5Gw_Y','2025-05-22 23:11:56.670813'),('a2mmlcll1ayk4lvyi4wk85drc9gq3smm','.eJxVjDkOwjAUBe_iGll4x5T0OYPlvxgHkCPFSYW4O4mUAto3M-8tUl6XmtbOcxpJXIW6iNPvCBmf3HZCj9zuk8SpLfMIclfkQbscJuLX7XD_Dmrudat1LAqtVsWgxYLKBF9CBMbA2hFDycaxAeu0dQxnbSlGIm_NxlF5LT5fIHE4aw:1uJa6C:XJkgx4EgHqr2ff6tQ3NyecjXb95FrRly4ngMLZDYz0A','2025-05-26 23:50:48.628273'),('afom7tgmrqvw7jaozx97t063tlke43ce','.eJxVjMsOgjAQRf-la9Mw9AHj0r3fQGamU0FNSSisjP-uJCx0e88592UG2tZx2Kouw5TM2QRz-t2Y5KFlB-lO5TZbmcu6TGx3xR602uuc9Hk53L-Dker4rZEcEOTGt6o-eA6YU48oKFEbyE4yaeh6FlAXozQQJXKL0HHnHEI27w_tAzfg:1uI6ia:L12cx0EYhaI4xaHUNrBqPVAMnzLF2sb9MOT3eerAiFw','2025-05-22 22:16:20.410362'),('atm87anz6mzddpp55jxcy6cv2wbmldn4','.eJxVjDkOwjAUBe_iGll4x5T0OYPlvxgHkCPFSYW4O4mUAto3M-8tUl6XmtbOcxpJXIW6iNPvCBmf3HZCj9zuk8SpLfMIclfkQbscJuLX7XD_Dmrudat1LAqtVsWgxYLKBF9CBMbA2hFDycaxAeu0dQxnbSlGIm_NxlF5LT5fIHE4aw:1uI4yz:99agahOFGSwrdZgp5bJOS88Py1Nz_CwtxFnSwv_XWv4','2025-05-22 20:25:09.412611'),('au0unwc7ucs0q5jeh666526l9frum0aj','.eJxVjEEOwiAQRe_C2pAZMlDq0r1nIAMMUjU0Ke3KeHdt0oVu_3vvv1Tgba1h67KEKauzQnX63SKnh7Qd5Du326zT3NZlinpX9EG7vs5ZnpfD_Tuo3Ou3BgPkDA2Jga0TQQ9YCIqNeSyJKBqLIHEoSFbYU0IXUUYA9Fysder9AcrGN1Q:1uI8EW:k1leVsqEW-hCdndIW1KPk4ZfREELH67tixfXr0-mV8Q','2025-05-22 23:53:24.763481'),('b88vwo5guyz044gjohwic7yokvq4wt0m','.eJxVjMsOgjAQRf-la9Mw9AHj0r3fQGamU0FNSSisjP-uJCx0e88592UG2tZx2Kouw5TM2QRz-t2Y5KFlB-lO5TZbmcu6TGx3xR602uuc9Hk53L-Dker4rZEcEOTGt6o-eA6YU48oKFEbyE4yaeh6FlAXozQQJXKL0HHnHEI27w_tAzfg:1uIPbA:3ZhTHb7IQeBOqH4hfX4Sy5fjxjv5tR5UiK5y7wjXEoo','2025-05-23 18:25:56.016990'),('bbufrpdmp9yemo80yf6sfo58ycky95nk','.eJxVjDkOwjAUBe_iGll4x5T0OYPlvxgHkCPFSYW4O4mUAto3M-8tUl6XmtbOcxpJXIW6iNPvCBmf3HZCj9zuk8SpLfMIclfkQbscJuLX7XD_Dmrudat1LAqtVsWgxYLKBF9CBMbA2hFDycaxAeu0dQxnbSlGIm_NxlF5LT5fIHE4aw:1uIByc:F3Jv2GpXslmJKIXVhk0qKXqpXLL_SSblHz9LwbW7iWk','2025-05-23 03:53:14.086887'),('bm906fbmljosns9xrisweo3hhpapumqj','.eJxVjEsOAiEQBe_C2hD5NIJL956BdEMjowaSYWZlvLtOMgvdvqp6LxFxXWpcB89xyuIslBaH35EwPbhtJN-x3bpMvS3zRHJT5E6HvPbMz8vu_h1UHPVbEykEW0pQ2gfQyWiNmNUJwIGz6DJ4z4YCJghHtMUpsr6gDcCWDGfx_gD9OzgK:1uHOdB:aQXw-SGMA-OigZYX7Yzu5megdgePC_z5b1kt4fEjgoY','2025-05-20 16:11:49.260726'),('bzdyyfgvmfymbm8zk8ax6nlkxsy40cl7','.eJxVjDkOwjAUBe_iGll4x5T0OYPlvxgHkCPFSYW4O4mUAto3M-8tUl6XmtbOcxpJXIW6iNPvCBmf3HZCj9zuk8SpLfMIclfkQbscJuLX7XD_Dmrudat1LAqtVsWgxYLKBF9CBMbA2hFDycaxAeu0dQxnbSlGIm_NxlF5LT5fIHE4aw:1uI5MC:VxwN27H79Bh3q0MAfRYg3Gth4lfh1H2xzatIirRLk3I','2025-05-22 20:49:08.624538'),('c2dgr9g6erduk9wypr8ouwkshk8tjhkz','.eJxVjDkOwjAUBe_iGll4x5T0OYPlvxgHkCPFSYW4O4mUAto3M-8tUl6XmtbOcxpJXIW6iNPvCBmf3HZCj9zuk8SpLfMIclfkQbscJuLX7XD_Dmrudat1LAqtVsWgxYLKBF9CBMbA2hFDycaxAeu0dQxnbSlGIm_NxlF5LT5fIHE4aw:1uI3gh:QA6DuTCP9UO-2H4M4er1_hZ-tL0s8gBUYeBpx6bSYY0','2025-05-22 12:02:11.857164'),('c4of46b1ay7kpqp5d7ghaldw214877hn','.eJxVjMsOgjAQRf-la9Mw9AHj0r3fQGamU0FNSSisjP-uJCx0e88592UG2tZx2Kouw5TM2QRz-t2Y5KFlB-lO5TZbmcu6TGx3xR602uuc9Hk53L-Dker4rZEcEOTGt6o-eA6YU48oKFEbyE4yaeh6FlAXozQQJXKL0HHnHEI27w_tAzfg:1uI7mN:O-7YAyVena3HKevxmVJ_7nlrSpTRMli5d8_m9op6RCc','2025-05-22 23:24:19.837471'),('c4yfohjry1bbkqmuagguaoqdccs4g4bc','.eJxVjMsOgjAQRf-la9Mw9AHj0r3fQGamU0FNSSisjP-uJCx0e88592UG2tZx2Kouw5TM2QRz-t2Y5KFlB-lO5TZbmcu6TGx3xR602uuc9Hk53L-Dker4rZEcEOTGt6o-eA6YU48oKFEbyE4yaeh6FlAXozQQJXKL0HHnHEI27w_tAzfg:1uI6rS:LteB52cO03t_0R2vd91NK8VD21QvLLeR_cCnX82c58k','2025-05-22 22:25:30.019371'),('c9549rqrxwyjavckc9fnxe2w1z3f0bpt','.eJxVjDkOwjAUBe_iGll4x5T0OYPlvxgHkCPFSYW4O4mUAto3M-8tUl6XmtbOcxpJXIW6iNPvCBmf3HZCj9zuk8SpLfMIclfkQbscJuLX7XD_Dmrudat1LAqtVsWgxYLKBF9CBMbA2hFDycaxAeu0dQxnbSlGIm_NxlF5LT5fIHE4aw:1uI5eT:J-0yPrFmlhZQFFyiapL5YYF8nHgcD_i0xPXfDr4wi6I','2025-05-22 21:08:01.410719'),('d0kvmivz1sjjxy47d8p8bo4708pmhx4l','.eJxVjDkOwjAUBe_iGll4x5T0OYPlvxgHkCPFSYW4O4mUAto3M-8tUl6XmtbOcxpJXIW6iNPvCBmf3HZCj9zuk8SpLfMIclfkQbscJuLX7XD_Dmrudat1LAqtVsWgxYLKBF9CBMbA2hFDycaxAeu0dQxnbSlGIm_NxlF5LT5fIHE4aw:1uI6Yi:DXmjuli_pcSuhxHRcZMylUWi3XgyM1DwK3KVzFh3PdQ','2025-05-22 22:06:08.490593'),('d6z16stl62ogqj8z08gloop2pw682fkm','.eJxVjDkOwjAUBe_iGll4x5T0OYPlvxgHkCPFSYW4O4mUAto3M-8tUl6XmtbOcxpJXIW6iNPvCBmf3HZCj9zuk8SpLfMIclfkQbscJuLX7XD_Dmrudat1LAqtVsWgxYLKBF9CBMbA2hFDycaxAeu0dQxnbSlGIm_NxlF5LT5fIHE4aw:1uI5Z0:ZIn00Ex2BWkkD2U6wF675rgnG1qLq6I4_onWj0fi-3Y','2025-05-22 21:02:22.865089'),('e0ad2zsum6d0g3g3e5i863asrufgv3it','.eJxVjMsOgjAQRf-la9Mw9AHj0r3fQGamU0FNSSisjP-uJCx0e88592UG2tZx2Kouw5TM2QRz-t2Y5KFlB-lO5TZbmcu6TGx3xR602uuc9Hk53L-Dker4rZEcEOTGt6o-eA6YU48oKFEbyE4yaeh6FlAXozQQJXKL0HHnHEI27w_tAzfg:1uJYvq:GqC2MQN-Nq8jB4J0BW2BK_WVrBL-Zou7xjqsWhT8qnc','2025-05-26 22:36:02.050386'),('edkdgyo2uq05w4k0ndqc353lt9g5x5gs','.eJxVjMsOgjAQRf-la9Mw9AHj0r3fQGamU0FNSSisjP-uJCx0e88592UG2tZx2Kouw5TM2QRz-t2Y5KFlB-lO5TZbmcu6TGx3xR602uuc9Hk53L-Dker4rZEcEOTGt6o-eA6YU48oKFEbyE4yaeh6FlAXozQQJXKL0HHnHEI27w_tAzfg:1uI6zm:d6IZWhbwYUzJRpg0BwKBWA9QFHXVkLc3FnmtMh0aRzY','2025-05-22 22:34:06.863718'),('f31fmqwy9o54xdlxgshsj7ostnsaqp0p','.eJxVjDkOwjAUBe_iGll4x5T0OYPlvxgHkCPFSYW4O4mUAto3M-8tUl6XmtbOcxpJXIW6iNPvCBmf3HZCj9zuk8SpLfMIclfkQbscJuLX7XD_Dmrudat1LAqtVsWgxYLKBF9CBMbA2hFDycaxAeu0dQxnbSlGIm_NxlF5LT5fIHE4aw:1uI3CW:O4Sum92OndeE0giVc4UiUzA7JpXI6yfMgWmweYSKqZQ','2025-05-22 11:31:00.379240'),('f4f4zbqe4sx6m99qu5gyywuuds7n7cq2','.eJxVjDkOwjAUBe_iGll4x5T0OYPlvxgHkCPFSYW4O4mUAto3M-8tUl6XmtbOcxpJXIW6iNPvCBmf3HZCj9zuk8SpLfMIclfkQbscJuLX7XD_Dmrudat1LAqtVsWgxYLKBF9CBMbA2hFDycaxAeu0dQxnbSlGIm_NxlF5LT5fIHE4aw:1uI5GK:Uak0Z0v9GuHM8C7MlqSXSxnDPXqLhqqM5OuscF3oosU','2025-05-22 20:43:04.999048'),('g87ugcpavn3giwz719ns67gk7jv6o361','.eJxVjE0OwiAYBe_C2hCgDYJL956BfH9I1UBS2lXj3bVJF7p9M_M2lWBdSlq7zGlidVHOqNPviEBPqTvhB9R709TqMk-od0UftOtbY3ldD_fvoEAv39pbSzCCZWco2BCIhZmBJRJlcSLI5CIOA0McxSDAOebsjc_kwWdU7w9PITpn:1uJqSg:4hjDPsl7C0hsyBA4GIBaDL_svTmNt6cK67z2ifiE-G4','2025-05-27 17:19:06.658766'),('gbrd34t2nqsvou3oph8v7g2uov1pytx4','.eJxVjEEOwiAQRe_C2pAZMlDq0r1nIAMMUjU0Ke3KeHdt0oVu_3vvv1Tgba1h67KEKauzQnX63SKnh7Qd5Du326zT3NZlinpX9EG7vs5ZnpfD_Tuo3Ou3BgPkDA2Jga0TQQ9YCIqNeSyJKBqLIHEoSFbYU0IXUUYA9Fysder9AcrGN1Q:1uI9R9:j54DMRqy9NkRaBGDv7HPmron1pT2VarSGXRRZAA6U8E','2025-05-23 01:10:31.482672'),('h7ybmbjem1to6zwj0cwn73v44uxkfhx3','.eJxVjDkOwjAUBe_iGll4x5T0OYPlvxgHkCPFSYW4O4mUAto3M-8tUl6XmtbOcxpJXIW6iNPvCBmf3HZCj9zuk8SpLfMIclfkQbscJuLX7XD_Dmrudat1LAqtVsWgxYLKBF9CBMbA2hFDycaxAeu0dQxnbSlGIm_NxlF5LT5fIHE4aw:1uI5GM:sdYqP1evhRwcu3Sjg1K4mv8ZADJmJPSzt_ylynUY9uE','2025-05-22 20:43:06.688300'),('hft2i3jdceejky59dwgmivmqkrnpeavp','.eJxVjDkOwjAUBe_iGll4x5T0OYPlvxgHkCPFSYW4O4mUAto3M-8tUl6XmtbOcxpJXIW6iNPvCBmf3HZCj9zuk8SpLfMIclfkQbscJuLX7XD_Dmrudat1LAqtVsWgxYLKBF9CBMbA2hFDycaxAeu0dQxnbSlGIm_NxlF5LT5fIHE4aw:1uI4sp:s8lkTx2Azs4JD5Ub8VkMYikXXY_yixdflOYL7CLNudo','2025-05-22 20:18:47.194288'),('hxpxizmfw97pybiqcucw9cgrus15ghre','.eJxVjMsOgjAQRf-la9Mw9AHj0r3fQGamU0FNSSisjP-uJCx0e88592UG2tZx2Kouw5TM2QRz-t2Y5KFlB-lO5TZbmcu6TGx3xR602uuc9Hk53L-Dker4rZEcEOTGt6o-eA6YU48oKFEbyE4yaeh6FlAXozQQJXKL0HHnHEI27w_tAzfg:1uI6zA:Giqns1thtcX-Qb5JAoZmdl7gx3KR6At4A7thqLvkNK0','2025-05-22 22:33:28.795704'),('i7r964tnq7pxc1e10dhd6t3giqyr8fzg','.eJxVjMsOgjAQRf-la9Mw9AHj0r3fQGamU0FNSSisjP-uJCx0e88592UG2tZx2Kouw5TM2QRz-t2Y5KFlB-lO5TZbmcu6TGx3xR602uuc9Hk53L-Dker4rZEcEOTGt6o-eA6YU48oKFEbyE4yaeh6FlAXozQQJXKL0HHnHEI27w_tAzfg:1uI7mO:US6vTlCfS8rM7FDN9AOSVLaNlJE_QjIsNMrSQ15FGA4','2025-05-22 23:24:20.744292'),('i8o173wu1aiqx50vnybkh0qphl0crrde','.eJxVjEsOAiEQBe_C2hD5NIJL956BdEMjowaSYWZlvLtOMgvdvqp6LxFxXWpcB89xyuIslBaH35EwPbhtJN-x3bpMvS3zRHJT5E6HvPbMz8vu_h1UHPVbEykEW0pQ2gfQyWiNmNUJwIGz6DJ4z4YCJghHtMUpsr6gDcCWDGfx_gD9OzgK:1uHOmM:62FAQzuY8bciaRVEbm6sMSdXekuftyybNj26AM4udbg','2025-05-20 16:21:18.224874'),('igxquxl525xxk2oxg06140ft2sskkthv','.eJxVjDkOwjAUBe_iGll4x5T0OYPlvxgHkCPFSYW4O4mUAto3M-8tUl6XmtbOcxpJXIW6iNPvCBmf3HZCj9zuk8SpLfMIclfkQbscJuLX7XD_Dmrudat1LAqtVsWgxYLKBF9CBMbA2hFDycaxAeu0dQxnbSlGIm_NxlF5LT5fIHE4aw:1uJU1q:z2C7D7hR2SR0AjInHW9J9s0IIoW2kV-kOVGn9z6r-aw','2025-05-26 17:21:54.802640'),('izo01mh3czvqrww8og84zd8ul7j0wq49','.eJxVjEsOAiEQBe_C2hD5NIJL956BdEMjowaSYWZlvLtOMgvdvqp6LxFxXWpcB89xyuIslBaH35EwPbhtJN-x3bpMvS3zRHJT5E6HvPbMz8vu_h1UHPVbEykEW0pQ2gfQyWiNmNUJwIGz6DJ4z4YCJghHtMUpsr6gDcCWDGfx_gD9OzgK:1uHP0U:59LC9_Gdqcv-g1AnW6R2y7vRGidEI1H7Zr3zZ3U4hWc','2025-05-20 16:35:54.615666'),('jd9z5bdtcbmju5b9awklqna90i6nkqf6','.eJxVjMsOgjAQRf-la9Mw9AHj0r3fQGamU0FNSSisjP-uJCx0e88592UG2tZx2Kouw5TM2QRz-t2Y5KFlB-lO5TZbmcu6TGx3xR602uuc9Hk53L-Dker4rZEcEOTGt6o-eA6YU48oKFEbyE4yaeh6FlAXozQQJXKL0HHnHEI27w_tAzfg:1uI6cf:ywaj3Kzv9dLVzkA9bqm-QL5pEhqtBBN2ZB1l0b3AFNI','2025-05-22 22:10:13.694573'),('jvoetibtlcaa19ns2uhsy75c7nz3ji1r','.eJxVjEEOwiAQRe_C2pAZMlDq0r1nIAMMUjU0Ke3KeHdt0oVu_3vvv1Tgba1h67KEKauzQnX63SKnh7Qd5Du326zT3NZlinpX9EG7vs5ZnpfD_Tuo3Ou3BgPkDA2Jga0TQQ9YCIqNeSyJKBqLIHEoSFbYU0IXUUYA9Fysder9AcrGN1Q:1uJvCi:aXe0Tg4dsqhxnasndjbcrtVWApSjzy9rmtrK6PNbpb4','2025-05-27 22:22:56.658842'),('kdzekx9erdx87ep52m5mfa5aog33cf08','.eJxVjMsOgjAQRf-la9Mw9AHj0r3fQGamU0FNSSisjP-uJCx0e88592UG2tZx2Kouw5TM2QRz-t2Y5KFlB-lO5TZbmcu6TGx3xR602uuc9Hk53L-Dker4rZEcEOTGt6o-eA6YU48oKFEbyE4yaeh6FlAXozQQJXKL0HHnHEI27w_tAzfg:1uI7vN:IXg9O_mNjy6YuEDUzZBUwTaYnWbh0iG7JF7rGWF-X2g','2025-05-22 23:33:37.345373'),('koq4nvqmjodysy7ol1iye5q2byf96wo5','.eJxVjEsOAiEQBe_C2hD5NIJL956BdEMjowaSYWZlvLtOMgvdvqp6LxFxXWpcB89xyuIslBaH35EwPbhtJN-x3bpMvS3zRHJT5E6HvPbMz8vu_h1UHPVbEykEW0pQ2gfQyWiNmNUJwIGz6DJ4z4YCJghHtMUpsr6gDcCWDGfx_gD9OzgK:1uHi0G:fMDLpWMpdGKw5QxAAf28zRXzCktmio3CVZsktgIWhDk','2025-05-21 12:52:56.681194'),('l09qboqh80bdrb9hz4i61abre5eb11n6','.eJxVjDkOwjAUBe_iGll4x5T0OYPlvxgHkCPFSYW4O4mUAto3M-8tUl6XmtbOcxpJXIW6iNPvCBmf3HZCj9zuk8SpLfMIclfkQbscJuLX7XD_Dmrudat1LAqtVsWgxYLKBF9CBMbA2hFDycaxAeu0dQxnbSlGIm_NxlF5LT5fIHE4aw:1uI3Ip:4yR1zOEgpSvl565yDInmQVhuyHcEB8jruitCf-rBnlg','2025-05-22 11:37:31.310131'),('lzl27git2edxj44nmt1kft29xejz3ep0','.eJxVjMsOgjAQRf-la9Mw9AHj0r3fQGamU0FNSSisjP-uJCx0e88592UG2tZx2Kouw5TM2QRz-t2Y5KFlB-lO5TZbmcu6TGx3xR602uuc9Hk53L-Dker4rZEcEOTGt6o-eA6YU48oKFEbyE4yaeh6FlAXozQQJXKL0HHnHEI27w_tAzfg:1uI6U1:zIyAbpCgDj2ZAOWHAa9L3aD0RJuD9FoEmtR8em4B9M8','2025-05-22 22:01:17.871568'),('me8nh0fnufv1fvyz8b4vb8nm3yhye7i0','.eJxVjEEOwiAQAP_C2RCWlgU8eu8bCCwgVQNJaU_GvxuSHvQ6M5k3c_7Yizt62twa2ZWBZpdfGDw9Ux0mPny9N06t7tsa-Ej4aTtfWkyv29n-DYrvZXyzmVHqrCCQxJgpICBCFJiVSCrSZCFABrJKgApkJjkD6AnJmpStZ58v_Yg3pw:1uI25F:eo3fVbOPpeffKTyCgUVmkECMhz5TKm8VvfQLRlceudo','2025-05-22 10:19:25.353700'),('mllym24qwpgxia0wbfpu3n1n80v7cu7r','.eJxVjMsOgjAQRf-la9Mw9AHj0r3fQGamU0FNSSisjP-uJCx0e88592UG2tZx2Kouw5TM2QRz-t2Y5KFlB-lO5TZbmcu6TGx3xR602uuc9Hk53L-Dker4rZEcEOTGt6o-eA6YU48oKFEbyE4yaeh6FlAXozQQJXKL0HHnHEI27w_tAzfg:1uI79i:o0Wpa6tC6XYq3iTQ4jp1NYTxlRoElvGOyxZ75Pav0gc','2025-05-22 22:44:22.541548'),('nc8yo5fdfb0m08uakfecjinipb1wl76q','.eJxVjEsOAiEQBe_C2hD5NIJL956BdEMjowaSYWZlvLtOMgvdvqp6LxFxXWpcB89xyuIslBaH35EwPbhtJN-x3bpMvS3zRHJT5E6HvPbMz8vu_h1UHPVbEykEW0pQ2gfQyWiNmNUJwIGz6DJ4z4YCJghHtMUpsr6gDcCWDGfx_gD9OzgK:1uHOxe:8L3HnTxmDJYf0MhO9k4md-kNvt59ZgikcFt_HP7Nwjg','2025-05-20 16:32:58.335008'),('nq8jh2f9ght2t2oixxf7qs0wkh34hooz','.eJxVjMsOgjAQRf-la9Mw9AHj0r3fQGamU0FNSSisjP-uJCx0e88592UG2tZx2Kouw5TM2QRz-t2Y5KFlB-lO5TZbmcu6TGx3xR602uuc9Hk53L-Dker4rZEcEOTGt6o-eA6YU48oKFEbyE4yaeh6FlAXozQQJXKL0HHnHEI27w_tAzfg:1uI6iH:fxuJs8kws7VjMty73R0I1nbbO28rsi-7qB0WFyu3ibs','2025-05-22 22:16:01.596513'),('o60n7lhs3d0ca2sul416cequidklvuex','.eJxVjMsOgjAQRf-la9Mw9AHj0r3fQGamU0FNSSisjP-uJCx0e88592UG2tZx2Kouw5TM2QRz-t2Y5KFlB-lO5TZbmcu6TGx3xR602uuc9Hk53L-Dker4rZEcEOTGt6o-eA6YU48oKFEbyE4yaeh6FlAXozQQJXKL0HHnHEI27w_tAzfg:1uI6bn:MuOSTp68OluP9WQet1QBTXvTNtBI_6L3M0gT3f1Cc5Q','2025-05-22 22:09:19.919558'),('o8mr84nz8l63vm0hieks6oobwlqj0kpl','.eJxVjDkOwjAUBe_iGll4x5T0OYPlvxgHkCPFSYW4O4mUAto3M-8tUl6XmtbOcxpJXIW6iNPvCBmf3HZCj9zuk8SpLfMIclfkQbscJuLX7XD_Dmrudat1LAqtVsWgxYLKBF9CBMbA2hFDycaxAeu0dQxnbSlGIm_NxlF5LT5fIHE4aw:1uI6Zk:m0ekRlYpbOKKoXM0mbIMyzysbFgtjjDpvOWR5GGXPPI','2025-05-22 22:07:12.310077'),('oypezbj2cxor574jptftrqvp9jp6khu3','.eJxVjDkOwjAUBe_iGll4x5T0OYPlvxgHkCPFSYW4O4mUAto3M-8tUl6XmtbOcxpJXIW6iNPvCBmf3HZCj9zuk8SpLfMIclfkQbscJuLX7XD_Dmrudat1LAqtVsWgxYLKBF9CBMbA2hFDycaxAeu0dQxnbSlGIm_NxlF5LT5fIHE4aw:1uI3Da:yOrIwD1paz9uLJDpYo0F5zsanDM-AnnpiwH0bwmQcSw','2025-05-22 11:32:06.569315'),('p4kbqmzgqaz9cu6mgk53vktv7kp7hk81','.eJxVjDkOwjAUBe_iGll4x5T0OYPlvxgHkCPFSYW4O4mUAto3M-8tUl6XmtbOcxpJXIW6iNPvCBmf3HZCj9zuk8SpLfMIclfkQbscJuLX7XD_Dmrudat1LAqtVsWgxYLKBF9CBMbA2hFDycaxAeu0dQxnbSlGIm_NxlF5LT5fIHE4aw:1uIPrb:VwEZvCPuDy3ZGD8e3jDNWfGhN7-cRN8F7sxINWvDLko','2025-05-23 18:42:55.769207'),('pcjy5fyiydofbj501k5xetgts2ikukax','.eJxVjMsOgjAQRf-la9Mw9AHj0r3fQGamU0FNSSisjP-uJCx0e88592UG2tZx2Kouw5TM2QRz-t2Y5KFlB-lO5TZbmcu6TGx3xR602uuc9Hk53L-Dker4rZEcEOTGt6o-eA6YU48oKFEbyE4yaeh6FlAXozQQJXKL0HHnHEI27w_tAzfg:1uI7ez:iETuFi1wgtx81YnVQJOKFx8Y1KAeI86nQc6HG_fC5pA','2025-05-22 23:16:41.190620'),('pd2ffreyygnr3utg80ew07f0tqh2wc6i','.eJxVjDkOwjAUBe_iGll4x5T0OYPlvxgHkCPFSYW4O4mUAto3M-8tUl6XmtbOcxpJXIW6iNPvCBmf3HZCj9zuk8SpLfMIclfkQbscJuLX7XD_Dmrudat1LAqtVsWgxYLKBF9CBMbA2hFDycaxAeu0dQxnbSlGIm_NxlF5LT5fIHE4aw:1uI58u:J17VWig5afg0XTjAFovRKj2hgfnV99YNkbVxgQSDvuM','2025-05-22 20:35:24.667591'),('po0xdyj6hbi6swt266856jn9yxmd08vu','.eJxVjEsOAiEQBe_C2hD5NIJL956BdEMjowaSYWZlvLtOMgvdvqp6LxFxXWpcB89xyuIslBaH35EwPbhtJN-x3bpMvS3zRHJT5E6HvPbMz8vu_h1UHPVbEykEW0pQ2gfQyWiNmNUJwIGz6DJ4z4YCJghHtMUpsr6gDcCWDGfx_gD9OzgK:1uHgZm:LBdWyY_o-N2tXwqSoAk3QzZwgRQKsoL_XjU6Lj9uWPo','2025-05-21 11:21:30.683525'),('pq5ty218sejbl77rnya41t6cy96sl00t','.eJxVjDkOwjAUBe_iGll4x5T0OYPlvxgHkCPFSYW4O4mUAto3M-8tUl6XmtbOcxpJXIW6iNPvCBmf3HZCj9zuk8SpLfMIclfkQbscJuLX7XD_Dmrudat1LAqtVsWgxYLKBF9CBMbA2hFDycaxAeu0dQxnbSlGIm_NxlF5LT5fIHE4aw:1uI3fu:3NK5df_QCsUIbZoexpe0koISM65ipHimd0SSS0eQa8o','2025-05-22 12:01:22.771284'),('pvlcffqq16tm00ukb22c6j5e6mnk4xfh','.eJxVjDkOwjAUBe_iGll4x5T0OYPlvxgHkCPFSYW4O4mUAto3M-8tUl6XmtbOcxpJXIW6iNPvCBmf3HZCj9zuk8SpLfMIclfkQbscJuLX7XD_Dmrudat1LAqtVsWgxYLKBF9CBMbA2hFDycaxAeu0dQxnbSlGIm_NxlF5LT5fIHE4aw:1uIBvA:ig64TYJvqCYoE7xcFyEofg9EPXMDQQ88twYLGqbh4YM','2025-05-23 03:49:40.853026'),('q2td1kbhg0xxukydgj0chsx5webor0by','.eJxVjDkOwjAUBe_iGll4x5T0OYPlvxgHkCPFSYW4O4mUAto3M-8tUl6XmtbOcxpJXIW6iNPvCBmf3HZCj9zuk8SpLfMIclfkQbscJuLX7XD_Dmrudat1LAqtVsWgxYLKBF9CBMbA2hFDycaxAeu0dQxnbSlGIm_NxlF5LT5fIHE4aw:1uI5F5:25BWbJ6UmI5wHrXA2Li5IBjtY-OxTshLWB9oaQKM2DU','2025-05-22 20:41:47.614735'),('qx6z5xfyiv0n8zwe9josz8czq3gaylua','.eJxVjDkOwjAUBe_iGll4x5T0OYPlvxgHkCPFSYW4O4mUAto3M-8tUl6XmtbOcxpJXIW6iNPvCBmf3HZCj9zuk8SpLfMIclfkQbscJuLX7XD_Dmrudat1LAqtVsWgxYLKBF9CBMbA2hFDycaxAeu0dQxnbSlGIm_NxlF5LT5fIHE4aw:1uI7DA:kbWbZoERvA8_OJOnr0csRIuRVuibWyV23EiyG1nU-zw','2025-05-22 22:47:56.808996'),('r9axxsksw7nla9txv6ro95rxficz1y65','.eJxVjDsOwjAQBe_iGlnG3w0lfc5g2btrHECOFCcV4u4QKQW0b2beS8S0rTVunZc4kbgIJ06_W0744LYDuqd2myXObV2mLHdFHrTLcSZ-Xg_376CmXr-1VoBpYACiDMpxKRYYYTDG2BKs0sp6tJAxaeUJnAmKjT5jCUjZkRfvD-VkN98:1uHOAr:fFRPKoTKDXRxMg62WOZ3Yqp1gotIaw5N1_HObF8qKDQ','2025-05-20 15:42:33.211845'),('ri57yumoovtzuxkirjrbdtfr8r8bqjle','.eJxVjEEOwiAQRe_C2pAZMlDq0r1nIAMMUjU0Ke3KeHdt0oVu_3vvv1Tgba1h67KEKauzQnX63SKnh7Qd5Du326zT3NZlinpX9EG7vs5ZnpfD_Tuo3Ou3BgPkDA2Jga0TQQ9YCIqNeSyJKBqLIHEoSFbYU0IXUUYA9Fysder9AcrGN1Q:1uJa5J:bdXibRBRxrBPUPW1gqFCfaDmkuZJBf2694RsSoT77P4','2025-05-26 23:49:53.712070'),('rqml4g4rxuhrsz2wzz8ydi8przxsbd2m','.eJxVjEsOAiEQBe_C2hD5NIJL956BdEMjowaSYWZlvLtOMgvdvqp6LxFxXWpcB89xyuIslBaH35EwPbhtJN-x3bpMvS3zRHJT5E6HvPbMz8vu_h1UHPVbEykEW0pQ2gfQyWiNmNUJwIGz6DJ4z4YCJghHtMUpsr6gDcCWDGfx_gD9OzgK:1uHOvz:aT6YJ1oNyjhs9CTecLY6XWjC7lkLf-tgteHnThb1lrE','2025-05-20 16:31:15.657180'),('ruha65h3mrvahexre61jugnun6e0bham','.eJxVjEEOwiAQRe_C2pAZMlDq0r1nIAMMUjU0Ke3KeHdt0oVu_3vvv1Tgba1h67KEKauzQnX63SKnh7Qd5Du326zT3NZlinpX9EG7vs5ZnpfD_Tuo3Ou3BgPkDA2Jga0TQQ9YCIqNeSyJKBqLIHEoSFbYU0IXUUYA9Fysder9AcrGN1Q:1uIU7g:R6ZdW6loDGyQDA4NxWmqiGBts2a0mcUA3pRCoOxGILo','2025-05-23 23:15:48.362493'),('rxhe35ffqzh297kcja9k8czmrpoyqraf','.eJxVjDkOwjAUBe_iGll4x5T0OYPlvxgHkCPFSYW4O4mUAto3M-8tUl6XmtbOcxpJXIW6iNPvCBmf3HZCj9zuk8SpLfMIclfkQbscJuLX7XD_Dmrudat1LAqtVsWgxYLKBF9CBMbA2hFDycaxAeu0dQxnbSlGIm_NxlF5LT5fIHE4aw:1uI79j:igVo6FjGxJA6nRlYf9p475eAkLWz89QBeU8J9Je_cH4','2025-05-22 22:44:23.417165'),('sm4an5bay48xsinxjbhzvd7m88oqcqz7','.eJxVjDkOwjAUBe_iGll4x5T0OYPlvxgHkCPFSYW4O4mUAto3M-8tUl6XmtbOcxpJXIW6iNPvCBmf3HZCj9zuk8SpLfMIclfkQbscJuLX7XD_Dmrudat1LAqtVsWgxYLKBF9CBMbA2hFDycaxAeu0dQxnbSlGIm_NxlF5LT5fIHE4aw:1uI7nP:Zop0H0ruGTf2B3ofmJ7IlIQEuXJmXv0KBt895HcJNb4','2025-05-22 23:25:23.187250'),('sr560uj8y0ej9es1rhl1c73ndrz8klhm','.eJxVjDsOwjAQBe_iGlnx-hdT0nMGa9f24gBypDipEHeHSCmgfTPzXiLitta49bLEKYuzACVOvyNhepS2k3zHdptlmtu6TCR3RR60y-ucy_NyuH8HFXv91rpYckgKXHHJB2JlFWedBhgxofc6mMCAGdlwKszaoDc0eA_AI1gS7w8jRTjD:1uKAaC:hvwfsQZ7lchWbUTM8NvrQrsvwp6V_05HBDnK2tzqA1o','2025-05-28 14:48:12.168733'),('stru0znivnvsuu3l8tjtc1pjrgiq1kuo','.eJxVjDkOwjAUBe_iGll4x5T0OYPlvxgHkCPFSYW4O4mUAto3M-8tUl6XmtbOcxpJXIW6iNPvCBmf3HZCj9zuk8SpLfMIclfkQbscJuLX7XD_Dmrudat1LAqtVsWgxYLKBF9CBMbA2hFDycaxAeu0dQxnbSlGIm_NxlF5LT5fIHE4aw:1uI5ak:MqKbrL0UkeNUER5tnGfY-WlD6iNU9N6dHZvpsVtFF48','2025-05-22 21:04:10.676985'),('szh2wqflkm13b62n4k4pxm7qohfbkleu','.eJxVjEEOwiAQRe_C2pAZMlDq0r1nIAMMUjU0Ke3KeHdt0oVu_3vvv1Tgba1h67KEKauzQnX63SKnh7Qd5Du326zT3NZlinpX9EG7vs5ZnpfD_Tuo3Ou3BgPkDA2Jga0TQQ9YCIqNeSyJKBqLIHEoSFbYU0IXUUYA9Fysder9AcrGN1Q:1uHlPz:AeVIOtUB0oszkGgdnDfbtyuhbhKLu3sj0slILmZOWsI','2025-05-21 16:31:43.596295'),('tj2hh9j9rpsbqe1nbsc61q9kziifxhp4','.eJxVjDkOwjAUBe_iGll4x5T0OYPlvxgHkCPFSYW4O4mUAto3M-8tUl6XmtbOcxpJXIW6iNPvCBmf3HZCj9zuk8SpLfMIclfkQbscJuLX7XD_Dmrudat1LAqtVsWgxYLKBF9CBMbA2hFDycaxAeu0dQxnbSlGIm_NxlF5LT5fIHE4aw:1uI26y:kpGFnNIBb2dOKO-wNT2tmg2b0Cpi2UFhc2hikC8fzuY','2025-05-22 10:21:12.305096'),('usteuf19y2qd505zu2m9laazar8bfgj9','.eJxVjDkOwjAUBe_iGll4x5T0OYPlvxgHkCPFSYW4O4mUAto3M-8tUl6XmtbOcxpJXIW6iNPvCBmf3HZCj9zuk8SpLfMIclfkQbscJuLX7XD_Dmrudat1LAqtVsWgxYLKBF9CBMbA2hFDycaxAeu0dQxnbSlGIm_NxlF5LT5fIHE4aw:1uI6cM:DgaKK0rCBAgLvXh5lXQc7tceUylaOdd_zpcBHuqk4qw','2025-05-22 22:09:54.504783'),('uw3e21tcdgzlahhcwi1ovl2rup8alrp3','.eJxVjDkOwjAUBe_iGll4x5T0OYPlvxgHkCPFSYW4O4mUAto3M-8tUl6XmtbOcxpJXIW6iNPvCBmf3HZCj9zuk8SpLfMIclfkQbscJuLX7XD_Dmrudat1LAqtVsWgxYLKBF9CBMbA2hFDycaxAeu0dQxnbSlGIm_NxlF5LT5fIHE4aw:1uI5CO:IQIG9BwsuRwBSVJDNz_IaCIxaqx-58BeDHN_AJxLbvo','2025-05-22 20:39:00.775474'),('uxy88nkufvjz6ifqa9z9jek4jclppd76','.eJxVjMsOgjAQRf-la9Mw9AHj0r3fQGamU0FNSSisjP-uJCx0e88592UG2tZx2Kouw5TM2QRz-t2Y5KFlB-lO5TZbmcu6TGx3xR602uuc9Hk53L-Dker4rZEcEOTGt6o-eA6YU48oKFEbyE4yaeh6FlAXozQQJXKL0HHnHEI27w_tAzfg:1uI7Fl:YLX4oOfzi5LF-9jhRJBtIJAX9pUkq-RJn6mS2CpqkA0','2025-05-22 22:50:37.893616'),('v0upwwreikbxb9ifk5itu0xmqmw2wxo3','.eJxVjE0OwiAYBe_C2hCgDYJL956BfH9I1UBS2lXj3bVJF7p9M_M2lWBdSlq7zGlidVHOqNPviEBPqTvhB9R709TqMk-od0UftOtbY3ldD_fvoEAv39pbSzCCZWco2BCIhZmBJRJlcSLI5CIOA0McxSDAOebsjc_kwWdU7w9PITpn:1uJqSf:gLnVrzhx5rY7bReqLv1sPuFM-0i1UNK2hgAQ2YgpfN8','2025-05-27 17:19:05.609001'),('vynjul1uc92g07bz8zovln65y51q3rif','.eJxVjDkOwjAUBe_iGll4x5T0OYPlvxgHkCPFSYW4O4mUAto3M-8tUl6XmtbOcxpJXIW6iNPvCBmf3HZCj9zuk8SpLfMIclfkQbscJuLX7XD_Dmrudat1LAqtVsWgxYLKBF9CBMbA2hFDycaxAeu0dQxnbSlGIm_NxlF5LT5fIHE4aw:1uI4wW:OrulmR1xT0OKnV9EMzzYQxeXUFd7nysKfb7H0A32lfM','2025-05-22 20:22:36.694131'),('wgerqssym5yyibn1g2yqvd49p4sgss4i','.eJxVjEEOwiAQRe_C2pAZMlDq0r1nIAMMUjU0Ke3KeHdt0oVu_3vvv1Tgba1h67KEKauzQnX63SKnh7Qd5Du326zT3NZlinpX9EG7vs5ZnpfD_Tuo3Ou3BgPkDA2Jga0TQQ9YCIqNeSyJKBqLIHEoSFbYU0IXUUYA9Fysder9AcrGN1Q:1uHh6f:J7haK7vL9XB0zA2ds38VJgjbQD-bx2fFADUiDsJo2Ok','2025-05-21 11:55:29.679719'),('x11ympsb9sc9k7p2nlxto8d29mtr393k','.eJxVjEsOAiEQBe_C2hD5NIJL956BdEMjowaSYWZlvLtOMgvdvqp6LxFxXWpcB89xyuIslBaH35EwPbhtJN-x3bpMvS3zRHJT5E6HvPbMz8vu_h1UHPVbEykEW0pQ2gfQyWiNmNUJwIGz6DJ4z4YCJghHtMUpsr6gDcCWDGfx_gD9OzgK:1uHOyF:IgujKkSvnIbyRzavnO3ozPQgEhbk1cnbsmres16vRFs','2025-05-20 16:33:35.137175'),('x1mkhfe30msqyobm5b6xdlnb9vt7ppqn','.eJxVjDkOwjAUBe_iGll4x5T0OYPlvxgHkCPFSYW4O4mUAto3M-8tUl6XmtbOcxpJXIW6iNPvCBmf3HZCj9zuk8SpLfMIclfkQbscJuLX7XD_Dmrudat1LAqtVsWgxYLKBF9CBMbA2hFDycaxAeu0dQxnbSlGIm_NxlF5LT5fIHE4aw:1uI3Fo:DNd76DasmZXZnzSwNTDEZ9XqnXbGs8YZ9X7sjJVVxpY','2025-05-22 11:34:24.943653'),('x54fhng291sz5enctlv1vkd3hlom7jl5','.eJxVjDkOwjAUBe_iGll4x5T0OYPlvxgHkCPFSYW4O4mUAto3M-8tUl6XmtbOcxpJXIW6iNPvCBmf3HZCj9zuk8SpLfMIclfkQbscJuLX7XD_Dmrudat1LAqtVsWgxYLKBF9CBMbA2hFDycaxAeu0dQxnbSlGIm_NxlF5LT5fIHE4aw:1uJU8b:G83iwS6q-sTdl4yyO6Dx2HntEfu-j3vo8fNWFA242f0','2025-05-26 17:28:53.223235'),('xj9ivra6woenbcqpjtvz3o14pivubn0z','.eJxVjDkOwjAUBe_iGll4x5T0OYPlvxgHkCPFSYW4O4mUAto3M-8tUl6XmtbOcxpJXIW6iNPvCBmf3HZCj9zuk8SpLfMIclfkQbscJuLX7XD_Dmrudat1LAqtVsWgxYLKBF9CBMbA2hFDycaxAeu0dQxnbSlGIm_NxlF5LT5fIHE4aw:1uI3dJ:yR6XjLMpWL3XURMzMvD8uCdkn6XHOHzKyvnlkfD7jyA','2025-05-22 11:58:41.299895'),('xonervi8izmscqthkx3f0i9gczlcimho','.eJxVjDkOwjAUBe_iGll4x5T0OYPlvxgHkCPFSYW4O4mUAto3M-8tUl6XmtbOcxpJXIW6iNPvCBmf3HZCj9zuk8SpLfMIclfkQbscJuLX7XD_Dmrudat1LAqtVsWgxYLKBF9CBMbA2hFDycaxAeu0dQxnbSlGIm_NxlF5LT5fIHE4aw:1uI7D7:0zlYcfEvQ1uSQM3uhdybVyfREBOhMYw3kLAB5a4YFsQ','2025-05-22 22:47:53.817342'),('xpeaumpgnpnv34a8q859klb5hr4jumkr','.eJxVjDkOwjAUBe_iGll4x5T0OYPlvxgHkCPFSYW4O4mUAto3M-8tUl6XmtbOcxpJXIW6iNPvCBmf3HZCj9zuk8SpLfMIclfkQbscJuLX7XD_Dmrudat1LAqtVsWgxYLKBF9CBMbA2hFDycaxAeu0dQxnbSlGIm_NxlF5LT5fIHE4aw:1uI6eO:gDEagzaRRbn8u7hswDGH0ovMnL82fiP1lucu0oCiado','2025-05-22 22:12:00.164900'),('xwdeb4xaoog37ah5uxr8sis7nzc1uxym','.eJxVjDkOwjAUBe_iGll4x5T0OYPlvxgHkCPFSYW4O4mUAto3M-8tUl6XmtbOcxpJXIW6iNPvCBmf3HZCj9zuk8SpLfMIclfkQbscJuLX7XD_Dmrudat1LAqtVsWgxYLKBF9CBMbA2hFDycaxAeu0dQxnbSlGIm_NxlF5LT5fIHE4aw:1uI5JR:lGD9EFqNaP1c_9DuwDUUrhFNrAGCBdOuD2fiKSUop8s','2025-05-22 20:46:17.313387'),('ycq8chkmbj3x0jhmx01y7c54hfgx4ia7','.eJxVjEsOAiEQBe_C2hD5NIJL956BdEMjowaSYWZlvLtOMgvdvqp6LxFxXWpcB89xyuIslBaH35EwPbhtJN-x3bpMvS3zRHJT5E6HvPbMz8vu_h1UHPVbEykEW0pQ2gfQyWiNmNUJwIGz6DJ4z4YCJghHtMUpsr6gDcCWDGfx_gD9OzgK:1uHOqP:-lmc37I6_H5Bo-cx78oPNscbZEJRQJ7Zl3GuOqldVsU','2025-05-20 16:25:29.392426'),('ykx17i6muvui83cjyolfluxnjgrxnqbo','.eJxVjDkOwjAUBe_iGll4x5T0OYPlvxgHkCPFSYW4O4mUAto3M-8tUl6XmtbOcxpJXIW6iNPvCBmf3HZCj9zuk8SpLfMIclfkQbscJuLX7XD_Dmrudat1LAqtVsWgxYLKBF9CBMbA2hFDycaxAeu0dQxnbSlGIm_NxlF5LT5fIHE4aw:1uI3xx:Qr4v8M0dRAlld5rn7jVrp2hyAkKx3rnf83TlwXEHJY4','2025-05-22 19:20:01.715126'),('yq3u1rkv9jt04rfih8086i4e47pyzhhi','.eJxVjDkOwjAUBe_iGll4x5T0OYPlvxgHkCPFSYW4O4mUAto3M-8tUl6XmtbOcxpJXIW6iNPvCBmf3HZCj9zuk8SpLfMIclfkQbscJuLX7XD_Dmrudat1LAqtVsWgxYLKBF9CBMbA2hFDycaxAeu0dQxnbSlGIm_NxlF5LT5fIHE4aw:1uI4rj:6pFpTc1LrbZefFqbIPHZ4Un1XjSYSoR2LGPrwG1v3O4','2025-05-22 20:17:39.615746'),('yx6xnvgqv7kqzwv4km2ak5vx2nf092qq','.eJxVjMsOgjAQRf-la9Mw9AHj0r3fQGamU0FNSSisjP-uJCx0e88592UG2tZx2Kouw5TM2QRz-t2Y5KFlB-lO5TZbmcu6TGx3xR602uuc9Hk53L-Dker4rZEcEOTGt6o-eA6YU48oKFEbyE4yaeh6FlAXozQQJXKL0HHnHEI27w_tAzfg:1uI6RP:M2_Ywe4Sin7s4jE2U_rtvk59yYpyLj1O7mXIcnx9hFE','2025-05-22 21:58:35.608703'),('z17fnqnbb4hmuppy8sfdlyf3rcwabeek','.eJxVjDkOwjAUBe_iGll4x5T0OYPlvxgHkCPFSYW4O4mUAto3M-8tUl6XmtbOcxpJXIW6iNPvCBmf3HZCj9zuk8SpLfMIclfkQbscJuLX7XD_Dmrudat1LAqtVsWgxYLKBF9CBMbA2hFDycaxAeu0dQxnbSlGIm_NxlF5LT5fIHE4aw:1uJU3h:ZTXDCE_uGQotKN7qdi4u376tIStEMEEwHAuzo-8SEpc','2025-05-26 17:23:49.538153'),('zps7ivgbs1y5m8g0225oenkhtzzkld5u','.eJxVjMsOgjAQRf-la9Mw9AHj0r3fQGamU0FNSSisjP-uJCx0e88592UG2tZx2Kouw5TM2QRz-t2Y5KFlB-lO5TZbmcu6TGx3xR602uuc9Hk53L-Dker4rZEcEOTGt6o-eA6YU48oKFEbyE4yaeh6FlAXozQQJXKL0HHnHEI27w_tAzfg:1uI6ra:KRu-otwZ1YOyLzsiYiSaRCBZeaDDCj6pM4eqQzNwLHU','2025-05-22 22:25:38.673124'),('zyvt1tmzr4v8ebkotvh6o01b2f05uuib','.eJxVjDkOwjAUBe_iGll4x5T0OYPlvxgHkCPFSYW4O4mUAto3M-8tUl6XmtbOcxpJXIW6iNPvCBmf3HZCj9zuk8SpLfMIclfkQbscJuLX7XD_Dmrudat1LAqtVsWgxYLKBF9CBMbA2hFDycaxAeu0dQxnbSlGIm_NxlF5LT5fIHE4aw:1uIApv:vDJBU8vdz34Kwg_XerXHwmMWOs-DYLpXInW7B0JDCEY','2025-05-23 02:40:11.509681');
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_site`
--

DROP TABLE IF EXISTS `django_site`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_site` (
  `id` int NOT NULL AUTO_INCREMENT,
  `domain` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_site_domain_a2e37b91_uniq` (`domain`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_site`
--

LOCK TABLES `django_site` WRITE;
/*!40000 ALTER TABLE `django_site` DISABLE KEYS */;
INSERT INTO `django_site` VALUES (1,'example.com','example.com');
/*!40000 ALTER TABLE `django_site` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gallery_media`
--

DROP TABLE IF EXISTS `gallery_media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gallery_media` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `datetime_posted` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gallery_media`
--

LOCK TABLES `gallery_media` WRITE;
/*!40000 ALTER TABLE `gallery_media` DISABLE KEYS */;
/*!40000 ALTER TABLE `gallery_media` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gallery_media_related_images`
--

DROP TABLE IF EXISTS `gallery_media_related_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gallery_media_related_images` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `media_id` bigint NOT NULL,
  `relatedimage_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `gallery_media_related_im_media_id_relatedimage_id_2f683604_uniq` (`media_id`,`relatedimage_id`),
  KEY `gallery_media_relate_relatedimage_id_329c8e39_fk_gallery_r` (`relatedimage_id`),
  CONSTRAINT `gallery_media_relate_media_id_a2b52c4e_fk_gallery_m` FOREIGN KEY (`media_id`) REFERENCES `gallery_media` (`id`),
  CONSTRAINT `gallery_media_relate_relatedimage_id_329c8e39_fk_gallery_r` FOREIGN KEY (`relatedimage_id`) REFERENCES `gallery_relatedimage` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gallery_media_related_images`
--

LOCK TABLES `gallery_media_related_images` WRITE;
/*!40000 ALTER TABLE `gallery_media_related_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `gallery_media_related_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gallery_relatedimage`
--

DROP TABLE IF EXISTS `gallery_relatedimage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gallery_relatedimage` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `image` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `caption` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gallery_relatedimage`
--

LOCK TABLES `gallery_relatedimage` WRITE;
/*!40000 ALTER TABLE `gallery_relatedimage` DISABLE KEYS */;
/*!40000 ALTER TABLE `gallery_relatedimage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `news_newsarticle`
--

DROP TABLE IF EXISTS `news_newsarticle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `news_newsarticle` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` date NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_featured` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `main_image` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `news_newsarticle`
--

LOCK TABLES `news_newsarticle` WRITE;
/*!40000 ALTER TABLE `news_newsarticle` DISABLE KEYS */;
INSERT INTO `news_newsarticle` VALUES (3,'Pepsi Partners with Quiver Club','2025-05-21','Pepsi announces exciting partnership with Quizer Club, bringing refreshing beverages to Kenya\'s favorite nightlife destination','<p><span style=\"background-color:rgb(255,255,255);color:rgb(34,34,34);font-family:Arial, Helvetica, sans-serif;\">Pepsi Kenya is proud to announce its new partnership with Quizer Club, one of Kenya\'s most popular nightlife destinations. This collaboration will bring refreshing Pepsi beverages to Quizer\'s vibrant atmosphere, enhancing the experience for partygoers.The partnership includes special promotions, branded events, and exclusive offers for Quizer Club visitors. Pepsi and Quizer Club will work together to create unique experiences that combine music, entertainment, and refreshing beverages.</span></p>',1,'2025-05-21 14:15:24.088810','2025-05-27 13:58:42.221059','partnerships','news/1000193872_KDZH6Av.jpg'),(4,'Pepsi Partners with Chicken Inn','2025-05-21','Pepsi and Chicken Inn join forces to offer refreshing beverages with delicious meals across Kenya','<p><span style=\"background-color:rgb(255,255,255);color:rgb(34,34,34);font-family:Arial, Helvetica, sans-serif;\">In a move to enhance customer experience, Pepsi Kenya has partnered with Chicken Inn, Kenya\'s leading fast food chain. This strategic collaboration will see Pepsi beverages being served alongside Chicken Inn\'s popular menu items across all outlets.The partnership includes special meal combos and promotional offers for customers. Pepsi and Chicken Inn will work together to create unique meal experiences that combine refreshing beverages with delicious food.</span></p>',0,'2025-05-21 14:54:25.178235','2025-05-27 14:09:05.283768','partnerships','news/1000195342.jpg'),(5,'Pepsi Wishes Happy Mother\'s Day','2025-05-21','Pepsi celebrates Mother\'s Day with special promotions and heartfelt messages across Kenya.','<p><span style=\"background-color:rgb(255,255,255);color:rgb(34,34,34);font-family:Arial, Helvetica, sans-serif;\">Pepsi Kenya joins the nation in celebrating Mother\'s Day with a special campaign that highlights the importance of mothers in our lives.The campaign includes social media shoutouts, special promotions, and heartfelt messages across all Pepsi platforms. Pepsi is also offering special discounts on selected products to help Kenyans celebrate their mothers in style.</span></p>',0,'2025-05-21 14:59:33.366816','2025-05-27 14:09:19.665507','events','news/471829873_627128159648697_4863865737252682846_n_V5WLCD1.jpg');
/*!40000 ALTER TABLE `news_newsarticle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `news_newsarticle_images`
--

DROP TABLE IF EXISTS `news_newsarticle_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `news_newsarticle_images` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `newsarticle_id` bigint NOT NULL,
  `newsimage_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `news_newsarticle_images_newsarticle_id_newsimage_3d69d4d6_uniq` (`newsarticle_id`,`newsimage_id`),
  KEY `news_newsarticle_ima_newsimage_id_f71bb82a_fk_news_news` (`newsimage_id`),
  CONSTRAINT `news_newsarticle_ima_newsarticle_id_17150d18_fk_news_news` FOREIGN KEY (`newsarticle_id`) REFERENCES `news_newsarticle` (`id`),
  CONSTRAINT `news_newsarticle_ima_newsimage_id_f71bb82a_fk_news_news` FOREIGN KEY (`newsimage_id`) REFERENCES `news_newsimage` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `news_newsarticle_images`
--

LOCK TABLES `news_newsarticle_images` WRITE;
/*!40000 ALTER TABLE `news_newsarticle_images` DISABLE KEYS */;
INSERT INTO `news_newsarticle_images` VALUES (1,3,1),(2,3,2),(3,4,3),(4,4,4),(5,5,5),(6,5,6);
/*!40000 ALTER TABLE `news_newsarticle_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `news_newsimage`
--

DROP TABLE IF EXISTS `news_newsimage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `news_newsimage` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `image` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `alt_text` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `news_newsimage`
--

LOCK TABLES `news_newsimage` WRITE;
/*!40000 ALTER TABLE `news_newsimage` DISABLE KEYS */;
INSERT INTO `news_newsimage` VALUES (1,'news/1000193872.jpg','event','2025-05-21 14:46:55.104302'),(2,'news/1000193872_tIF5YpF.jpg','event2','2025-05-21 14:47:15.584632'),(3,'news/1000193867_1_i9YB0uz.jpg','chicken inn partnership','2025-05-21 14:53:43.160036'),(4,'news/1000193867_1.jpg','chicken inn partnership 2','2025-05-21 14:54:23.344361'),(5,'news/1000193870.jpg','happy mothers day','2025-05-21 14:57:10.202950'),(6,'news/1000193872_5evIopt.jpg','happy mothers day 2','2025-05-21 14:59:27.881738');
/*!40000 ALTER TABLE `news_newsimage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `otps`
--

DROP TABLE IF EXISTS `otps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `otps` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `otp` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expirydate` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `otps`
--

LOCK TABLES `otps` WRITE;
/*!40000 ALTER TABLE `otps` DISABLE KEYS */;
INSERT INTO `otps` VALUES (1,'user@example.com','932344','2025-05-20 12:48:40.300608'),(3,'danquake2019@gmail.com','622647','2025-05-20 13:12:12.469533'),(4,'ephraimnorbat@gmail.com','377881','2025-05-20 13:40:22.932148'),(5,'ephraimnorbat@gmail.com','078131','2025-05-20 13:48:20.531740'),(7,'reactdev@hotmail.com','849088','2025-05-20 14:44:13.242101'),(9,'user4@example.com','018236','2025-05-20 15:06:53.000895'),(10,'ephraimnorbat@hotmail.com','812370','2025-05-20 15:10:06.177384'),(12,'officialdevduncan@gmail.com','549698','2025-05-20 15:27:12.879506');
/*!40000 ALTER TABLE `otps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `partner_partnerapplication`
--

DROP TABLE IF EXISTS `partner_partnerapplication`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `partner_partnerapplication` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(17) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  `company_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_back` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `business_license` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tax_certificate` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `distribution_area` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `submitted_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `admin_notes` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_front` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partner_partnerapplication`
--

LOCK TABLES `partner_partnerapplication` WRITE;
/*!40000 ALTER TABLE `partner_partnerapplication` DISABLE KEYS */;
INSERT INTO `partner_partnerapplication` VALUES (1,'testinguser','0712345678','testuser@gmail.com','GAggehw','partners/id_documents/Artboard-95300x_4KRM1FM.webp','partners/business_licenses/Artboard-95300x.webp','partners/tax_certificates/Artboard-100_1300x.webp','jhkji','pending','2025-05-20 15:58:00.617130','2025-05-20 15:58:00.617181','','partners/id_documents/Artboard-95300x.webp','user1'),(2,'Duncan','0757738641','danquake2019@gmail.com','SBC KENYA','partners/id_documents/pep-logo_pk36ETe.png','partners/business_licenses/pep-logo.png','','AZsxh','pending','2025-05-20 16:26:39.513174','2025-05-20 16:26:39.513269','','partners/id_documents/pep-logo.png','Macharia'),(3,'Ephraim','0728750764','ephraimnorbat@gmail.com','Trustpay','partners/id_documents/CAT_1_vWmuBnl.docx','partners/business_licenses/CAT_1.docx','partners/tax_certificates/CAT_1.docx','ksm','pending','2025-05-27 08:57:54.289009','2025-05-27 08:57:54.298428','','partners/id_documents/CAT_1.docx','Norbat'),(4,'Ephraim','0728750764','ephraimnorbat@gmail.com','Trustpay','partners/id_documents/CAT_1_lpxo37K.docx','partners/business_licenses/CAT_1_EL26zVp.docx','partners/tax_certificates/CAT_1_qVxfKYK.docx','ksm','pending','2025-05-27 09:04:38.084423','2025-05-27 09:04:38.086318','','partners/id_documents/CAT_1_SLr17ch.docx','Norbat'),(5,'Ephraim','0728750764','ephraimnorbat@gmail.com','Trustpay','partners/id_documents/CAT_1_e2D5P87.docx','partners/business_licenses/CAT_1_nJC0CHF.docx','partners/tax_certificates/CAT_1_j2LqIux.docx','ksm','pending','2025-05-27 09:13:16.300324','2025-05-27 09:13:16.303758','','partners/id_documents/CAT_1_5WOcoPj.docx','Norbat'),(6,'Ephraim','0728750764','ephraimnorbat@gmail.com','Trustpay','partners/id_documents/CAT_1_D4acjUW.docx','partners/business_licenses/CAT_1_ouKykGR.docx','partners/tax_certificates/CAT_1_14y2FLR.docx','ksm','pending','2025-05-27 09:14:31.971896','2025-05-27 09:14:31.972054','','partners/id_documents/CAT_1_ljwsvr6.docx','Norbat'),(7,'Ephraim','0728750764','ephraimnorbat@gmail.com','Trustpay','partners/id_documents/CAT_1_mTUMMvD.docx','partners/business_licenses/CAT_1_XxgZ52K.docx','partners/tax_certificates/CAT_1_rp0ivJm.docx','ksm','pending','2025-05-27 09:15:57.043387','2025-05-27 09:15:57.043444','','partners/id_documents/CAT_1_CPKx6Be.docx','Norbat'),(8,'Ephraim','0728750764','ephraimnorbat@gmail.com','Trustpay','partners/id_documents/CAT_1_f9lgfst.docx','partners/business_licenses/CAT_1_UrYGgDY.docx','partners/tax_certificates/CAT_1_wMIBsHf.docx','ksm','pending','2025-05-27 09:19:34.670303','2025-05-27 09:19:34.670422','','partners/id_documents/CAT_1_TJhybxw.docx','Norbat'),(9,'Ephraim','0728750764','ephraimnorbat@gmail.com','Trustpay','partners/id_documents/CAT_1_y096kJw.docx','partners/business_licenses/CAT_1_QZmoh6r.docx','partners/tax_certificates/CAT_1_oDuOUKX.docx','ksm','pending','2025-05-27 09:20:48.697698','2025-05-27 09:20:48.697852','','partners/id_documents/CAT_1_4TZ3xS4.docx','Norbat'),(10,'Ephraim','0728750764','ephraimnorbat@gmail.com','Trustpay','partners/id_documents/CAT_1_3GVQUmy.docx','partners/business_licenses/CAT_1_Wi3lPif.docx','partners/tax_certificates/CAT_1_ZRXpF21.docx','ksm','pending','2025-05-27 09:24:13.583549','2025-05-27 09:24:13.584816','','partners/id_documents/CAT_1_ZamorO3.docx','Norbat'),(11,'Ephraim','0728750764','ephraimnorbat@gmail.com','Trustpay','partners/id_documents/CAT_1_S5TxGzG.docx','partners/business_licenses/CAT_1_d4j8V03.docx','partners/tax_certificates/CAT_1_cq2uMoN.docx','ksm','pending','2025-05-27 09:36:56.977833','2025-05-27 09:36:56.978984','','partners/id_documents/CAT_1_xhQgWHV.docx','Norbat'),(12,'Trust','790130642','ephraimnorbat@gmail.com','Trustpay','partners/id_documents/CAT_1_xhQgWHV_NyVYiYF.docx','partners/business_licenses/CAT_1_xhQgWHV.docx','partners/tax_certificates/CAT_1_xhQgWHV.docx','ksm','pending','2025-05-27 09:47:42.524987','2025-05-27 09:47:42.525068','','partners/id_documents/CAT_1_xhQgWHV_XrrNVFB.docx','Pay'),(13,'Trust','790130642','ephraimnorbat@gmail.com','Trustpay','partners/id_documents/CAT_1_xhQgWHV_o8RQZpm.docx','partners/business_licenses/CAT_1_xhQgWHV_XH2ttth.docx','partners/tax_certificates/CAT_1_xhQgWHV_vpmwHkO.docx','ksm','pending','2025-05-27 09:49:25.920043','2025-05-27 09:49:25.920103','','partners/id_documents/CAT_1_xhQgWHV_SB0N0sD.docx','Pay'),(14,'Trust','790130642','ephraimnorbat@gmail.com','Trustpay','partners/id_documents/CAT_1_xhQgWHV_ehn2vop.docx','partners/business_licenses/CAT_1_xhQgWHV_0niJlVB.docx','partners/tax_certificates/CAT_1_xhQgWHV_thL6hIz.docx','ksm','pending','2025-05-27 09:50:38.175878','2025-05-27 09:50:38.175926','','partners/id_documents/CAT_1_xhQgWHV_0OTDOD8.docx','Pay'),(15,'Trust','790130642','ephraimnorbat@gmail.com','Trustpay','partners/id_documents/CAT_1_xhQgWHV_FhZ4NEf.docx','partners/business_licenses/CAT_1_xhQgWHV_xZUaVNc.docx','partners/tax_certificates/CAT_1_xhQgWHV_2xYB7Lq.docx','ksm','pending','2025-05-27 09:52:44.681071','2025-05-27 09:52:44.681133','','partners/id_documents/CAT_1_xhQgWHV_P70o0xs.docx','Pay'),(16,'Trust','790130642','ephraimnorbat@gmail.com','Trustpay','partners/id_documents/CAT_1_xhQgWHV_ftDpOn6.docx','partners/business_licenses/CAT_1_xhQgWHV_9F6NdF2.docx','partners/tax_certificates/CAT_1_xhQgWHV_WE2XP6t.docx','ksm','pending','2025-05-27 10:38:14.257684','2025-05-27 10:38:14.257894','','partners/id_documents/CAT_1_xhQgWHV_ssjwzHc.docx','Pay'),(17,'Trust','790130642','ephraimnorbat@gmail.com','Trustpay','partners/id_documents/CAT_1_xhQgWHV_3syb5kw.docx','partners/business_licenses/CAT_1_xhQgWHV_8LTOZyd.docx','partners/tax_certificates/CAT_1_xhQgWHV_i68e2cY.docx','ksm','pending','2025-05-27 10:52:30.166368','2025-05-27 10:52:30.166413','','partners/id_documents/CAT_1_xhQgWHV_LQH7ekr.docx','Pay'),(18,'Trust','790130642','ephraimnorbat@gmail.com','Trustpay','partners/id_documents/CAT_1_xhQgWHV_ykaZXzd.docx','partners/business_licenses/CAT_1_xhQgWHV_WfxZNKq.docx','partners/tax_certificates/CAT_1_xhQgWHV_YhQAeVy.docx','ksm','pending','2025-05-27 10:53:42.130481','2025-05-27 10:53:42.130546','','partners/id_documents/CAT_1_xhQgWHV_n4g5nlf.docx','Pay'),(19,'Trust','790130642','mestechsln@gmail.com','Trustpay','partners/id_documents/CAT_1_xhQgWHV_fKrrM3F.docx','partners/business_licenses/CAT_1_xhQgWHV_NZdU4Pl.docx','partners/tax_certificates/CAT_1_xhQgWHV_TcI7VOc.docx','KSM','pending','2025-05-27 12:44:34.260096','2025-05-27 12:44:34.260153','','partners/id_documents/CAT_1_xhQgWHV_m37lnfz.docx','Pay'),(20,'Trust','790130642','mestechsln@gmail.com','Trustpay','partners/id_documents/CAT_1_xhQgWHV_82D0bCf.docx','partners/business_licenses/CAT_1_xhQgWHV_Gjwr10Z.docx','partners/tax_certificates/CAT_1_xhQgWHV_xlR3h5P.docx','KSM','pending','2025-05-27 12:50:42.303744','2025-05-27 12:50:42.303804','','partners/id_documents/CAT_1_xhQgWHV_63qWr97.docx','Pay'),(21,'Trust','790130642','mestechsln@gmail.com','Trustpay','partners/id_documents/CAT_1_xhQgWHV_4RY3V4S.docx','partners/business_licenses/CAT_1_xhQgWHV_h9bSJe7.docx','partners/tax_certificates/CAT_1_xhQgWHV_5Soiacs.docx','KSM','pending','2025-05-27 13:06:36.903472','2025-05-27 13:06:36.903510','','partners/id_documents/CAT_1_xhQgWHV_beZBYVT.docx','Pay'),(22,'Trust','790130642','mestechsln@gmail.com','Trustpay','partners/id_documents/CAT_1_xhQgWHV_4peIf5A.docx','partners/business_licenses/CAT_1_xhQgWHV_rf6fInq.docx','partners/tax_certificates/CAT_1_xhQgWHV_yg11qdN.docx','KSM','pending','2025-05-27 13:08:47.011318','2025-05-27 13:08:47.011360','','partners/id_documents/CAT_1_xhQgWHV_KdP2WvY.docx','Pay'),(23,'Duncan','0757738641','danquake2019@gmail.com','SBC KENYA','partners/id_documents/1000028508.jpg','partners/business_licenses/IMG-20250407-WA0010.jpg','','Nairobi','pending','2025-05-27 13:16:00.207471','2025-05-27 13:16:00.208599','','partners/id_documents/1000028511.jpg','Macharia');
/*!40000 ALTER TABLE `partner_partnerapplication` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `procurement_tender`
--

DROP TABLE IF EXISTS `procurement_tender`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `procurement_tender` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reference_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `requirements` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `submission_guidelines` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `document` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `published_date` datetime(6) NOT NULL,
  `closing_date` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `reference_number` (`reference_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `procurement_tender`
--

LOCK TABLES `procurement_tender` WRITE;
/*!40000 ALTER TABLE `procurement_tender` DISABLE KEYS */;
/*!40000 ALTER TABLE `procurement_tender` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recruitment_jobadvertisement`
--

DROP TABLE IF EXISTS `recruitment_jobadvertisement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recruitment_jobadvertisement` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `requirements` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `responsibilities` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `location` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `posted_date` datetime(6) NOT NULL,
  `closing_date` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recruitment_jobadvertisement`
--

LOCK TABLES `recruitment_jobadvertisement` WRITE;
/*!40000 ALTER TABLE `recruitment_jobadvertisement` DISABLE KEYS */;
INSERT INTO `recruitment_jobadvertisement` VALUES (1,'Plant Engineer','uytredfvgbnTestuytredfvgbnTest\r\nuytredfvgbnTestuytredfvgbnTest\r\nuytredfvgbnTestuytredfvgbnTest','uytredfvgbnTestuytredfvgbnTest\r\nuytredfvgbnTestuytredfvgbnTest\r\nuytredfvgbnTestuytredfvgbnTest','uytredfvgbnTestuytredfvgbnTest\r\nuytredfvgbnTestuytredfvgbnTest\r\nuytredfvgbnTestuytredfvgbnTest\r\nuytredfvgbnTestuytredfvgbnTest','Nairobi',1,'2025-05-22 10:54:56.000000','2025-05-31 10:55:43.000000');
/*!40000 ALTER TABLE `recruitment_jobadvertisement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recruitment_jobapplication`
--

DROP TABLE IF EXISTS `recruitment_jobapplication`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recruitment_jobapplication` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `position` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `experience` longtext COLLATE utf8mb4_unicode_ci,
  `applicant_name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cover_letter` longtext COLLATE utf8mb4_unicode_ci,
  `resume_url` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `applied_date` datetime(6) NOT NULL,
  `job_advertisement_id` bigint NOT NULL,
  `notes` longtext COLLATE utf8mb4_unicode_ci,
  `skills` json NOT NULL DEFAULT (_utf8mb3'[]'),
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `recruitment_jobappli_job_advertisement_id_e37f526d_fk_recruitme` (`job_advertisement_id`),
  CONSTRAINT `recruitment_jobappli_job_advertisement_id_e37f526d_fk_recruitme` FOREIGN KEY (`job_advertisement_id`) REFERENCES `recruitment_jobadvertisement` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recruitment_jobapplication`
--

LOCK TABLES `recruitment_jobapplication` WRITE;
/*!40000 ALTER TABLE `recruitment_jobapplication` DISABLE KEYS */;
INSERT INTO `recruitment_jobapplication` VALUES (1,'Trust Pay','mestechsln@gmail.com','790130642','hrtgwfsb','rsegv','strhwthrthr','resumes/Assignment_1_1.pdf','2025-05-22 10:57:08.952159',1,NULL,'[]','pending');
/*!40000 ALTER TABLE `recruitment_jobapplication` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sbcapp_customuser`
--

DROP TABLE IF EXISTS `sbcapp_customuser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sbcapp_customuser` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `password` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  `phone_number` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_verified` tinyint(1) NOT NULL,
  `user_role` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `sbcapp_customuser_email_0dc31e82_uniq` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sbcapp_customuser`
--

LOCK TABLES `sbcapp_customuser` WRITE;
/*!40000 ALTER TABLE `sbcapp_customuser` DISABLE KEYS */;
INSERT INTO `sbcapp_customuser` VALUES (1,'pbkdf2_sha256$600000$7ARH3lnrxsEpxH9HvjALHY$qIDT6BANelXtCmOYgigToi/ST6ox68LhyUvyeL8sshM=','2025-05-28 06:41:45.138697',1,'Sbcuser','','','info@sbckenya.com',1,1,'2025-05-20 11:50:10.694847',NULL,1,4),(2,'pbkdf2_sha256$600000$XMxmkHYVNhcPMnK9NlFXeL$aW244Y8WYJfuKTZbQw41ed3tMWhpYCJFM2SMQRaMz/o=','2025-05-20 11:52:19.000000',0,'TestUser','','','user@example.com',0,1,'2025-05-20 11:52:18.000000',NULL,0,4),(3,'pbkdf2_sha256$600000$j3mqD9zj4qkjeQeu52cuVP$vUKKK9B1bUrVXt0dlcyl6VnejxXGSDUVM4HfhW+FnzY=','2025-05-20 12:10:02.000000',0,'machaa','','','danquake12019@gmail.com',0,1,'2025-05-20 12:10:00.000000',NULL,0,4),(4,'pbkdf2_sha256$600000$44aVtP2urZoZjdrYvhNVug$MeRbgsZldGuypT73kLngWTgUQWPIMWIPZHnWp0nb6tw=',NULL,0,'user','testinguser','user1','user2@example.com',0,1,'2025-05-20 12:38:40.000000','0712345678',0,4),(5,'pbkdf2_sha256$600000$jNJ7jWAWRzLY2cql8RqJxi$ut0o2Eax5hHbn9WSMoIQXhoooNrZHZ6v8kkZN2iqYOg=','2025-05-26 14:36:01.963994',0,'ephraimnorbat','Ephraim','Norbat','ephraimnorbat@gmail.com',0,1,'2025-05-20 13:00:45.321809','0728750764',1,4),(7,'pbkdf2_sha256$600000$4kfzhybLzk1cVN7TaY9l8d$XHkoyrszhtmgCBdWV42F92GIjlhzdkuHiCWPpKIBGxo=',NULL,0,'user3','User3','Testing2','user3@example.com',0,1,'2025-05-20 14:10:46.734943','0712345687',1,4),(8,'pbkdf2_sha256$600000$sLnc1PUUXVq2Ttewnmbepl$2ydHDsBGr7RVxuyvlwDK5fL22LJKlxLK4lv2gumj51Y=',NULL,0,'reactdev','Ephraim','Dev','reactdev@hotmail.com',0,1,'2025-05-20 14:34:13.063176','0728750764',0,4),(10,'pbkdf2_sha256$600000$WzoNGCAldpwZcaGrOHCmXy$9HDkmns5R/qzB26xlgF1iuQCYuWGZipmkf/ELjFLIp8=',NULL,0,'user4','User4','Testing4','user4@example.com',0,1,'2025-05-20 14:56:52.814411','0712345687',0,4),(11,'pbkdf2_sha256$600000$pVcgupIoTEc2ORmkCOitNz$fRvXizvJI4hPAbpkiFwNmI1PZHoWk0HL8k00yoi0jo4=',NULL,0,'ephraimnorbat_1423','Phrazy','Dev','ephraimnorbat@hotmail.com',0,1,'2025-05-20 15:00:06.001269','0712345687',0,4),(14,'pbkdf2_sha256$600000$E56ceOtAxltQ5B8wAoMETj$pKnwbwbgG3dbOd1bM0nOjnruHO9LrLPPmC7+kbQOFwI=',NULL,0,'john.doe','John','Doe','john.doe@example.com',0,1,'2025-05-21 14:31:41.323212',NULL,0,4),(15,'pbkdf2_sha256$600000$YqTmRTsPpBIdQdDRVMx6of$8+7dWo+RpZALrmn4Lyl9FhovrHKylIegimClveyWa4c=',NULL,0,'pepeaexperience','John','Doe','pepeaexperience@gmail.com',0,1,'2025-05-21 15:01:54.000000',NULL,0,5),(16,'pbkdf2_sha256$600000$NAVlIqxU5SIviljFLK4h2p$MRQqjDoi2BBVRKpr4CkQpFvhJ+P6RfjjcVhvkLOGt9U=','2025-05-22 11:23:15.361093',0,'usertest','Test1T','UserTest2','usertest@gmail.com',0,1,'2025-05-22 08:17:57.377041','0712345678',1,4),(18,'pbkdf2_sha256$600000$d1j5saRXy8hG8mRnEmkw34$WuOxE6PJyDG7YoKHhPMBBELvQBt1Ij0H5AmMNEqCfxg=','2025-05-26 15:50:48.598172',0,'danquake2019','Duncan','Macharia','danquake2019@gmail.com',0,1,'2025-05-22 09:20:32.526581','0757738641',1,4),(19,'pbkdf2_sha256$600000$YH4JuLwWKnmOJUFUCKk3Hc$k5GSTT5YFgVjyJfEjuLUAx/vDTk938he+xBf3CfT96M=',NULL,0,'mestechsln','Ephraim','Norbat','mestechsln@gmail.com',0,1,'2025-05-26 14:56:31.280400',NULL,0,4),(20,'pbkdf2_sha256$600000$Uv7UDZFIHecBqhMjHb9Mvr$PfM0VQgD644fE9UXavotWj1QtCcbNXQkn33cgF/Xrwg=','2025-05-27 09:19:06.636425',0,'grahammoguche2019','Graham','Moguche','grahammoguche2019@gmail.com',0,1,'2025-05-27 09:17:18.319983','0717334912',1,4),(21,'pbkdf2_sha256$600000$5GV6cGNwD0iAcSm5YfkU0f$P+yQrdeCzKsQqgFliGQ8xV5N4+lDHBEQgMh4p8WCOTI=','2025-05-28 06:47:41.807163',0,'AdminOrder','Head Of','Orders','mt.orders@sbckenya.com',0,1,'2025-05-28 06:44:23.000000','0712345664',1,2);
/*!40000 ALTER TABLE `sbcapp_customuser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sbcapp_customuser_groups`
--

DROP TABLE IF EXISTS `sbcapp_customuser_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sbcapp_customuser_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `customuser_id` bigint NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sbcapp_customuser_groups_customuser_id_group_id_35fb3a3b_uniq` (`customuser_id`,`group_id`),
  KEY `sbcapp_customuser_groups_group_id_2adcfa99_fk_auth_group_id` (`group_id`),
  CONSTRAINT `sbcapp_customuser_gr_customuser_id_5cfa9aac_fk_sbcapp_cu` FOREIGN KEY (`customuser_id`) REFERENCES `sbcapp_customuser` (`id`),
  CONSTRAINT `sbcapp_customuser_groups_group_id_2adcfa99_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sbcapp_customuser_groups`
--

LOCK TABLES `sbcapp_customuser_groups` WRITE;
/*!40000 ALTER TABLE `sbcapp_customuser_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `sbcapp_customuser_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sbcapp_customuser_user_permissions`
--

DROP TABLE IF EXISTS `sbcapp_customuser_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sbcapp_customuser_user_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `customuser_id` bigint NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sbcapp_customuser_user_p_customuser_id_permission_ff3c7850_uniq` (`customuser_id`,`permission_id`),
  KEY `sbcapp_customuser_us_permission_id_a35a9ab7_fk_auth_perm` (`permission_id`),
  CONSTRAINT `sbcapp_customuser_us_customuser_id_e337f075_fk_sbcapp_cu` FOREIGN KEY (`customuser_id`) REFERENCES `sbcapp_customuser` (`id`),
  CONSTRAINT `sbcapp_customuser_us_permission_id_a35a9ab7_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sbcapp_customuser_user_permissions`
--

LOCK TABLES `sbcapp_customuser_user_permissions` WRITE;
/*!40000 ALTER TABLE `sbcapp_customuser_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sbcapp_customuser_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sbcapp_staticpage`
--

DROP TABLE IF EXISTS `sbcapp_staticpage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sbcapp_staticpage` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_updated` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sbcapp_staticpage`
--

LOCK TABLES `sbcapp_staticpage` WRITE;
/*!40000 ALTER TABLE `sbcapp_staticpage` DISABLE KEYS */;
/*!40000 ALTER TABLE `sbcapp_staticpage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `social_sociallink`
--

DROP TABLE IF EXISTS `social_sociallink`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `social_sociallink` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `platform` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon_class` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_order` int unsigned NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `social_sociallink_chk_1` CHECK ((`display_order` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `social_sociallink`
--

LOCK TABLES `social_sociallink` WRITE;
/*!40000 ALTER TABLE `social_sociallink` DISABLE KEYS */;
/*!40000 ALTER TABLE `social_sociallink` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `socialaccount_socialaccount`
--

DROP TABLE IF EXISTS `socialaccount_socialaccount`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `socialaccount_socialaccount` (
  `id` int NOT NULL AUTO_INCREMENT,
  `provider` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `uid` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_login` datetime(6) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  `extra_data` json NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `socialaccount_socialaccount_provider_uid_fc810c6e_uniq` (`provider`,`uid`),
  KEY `socialaccount_social_user_id_8146e70c_fk_sbcapp_cu` (`user_id`),
  CONSTRAINT `socialaccount_social_user_id_8146e70c_fk_sbcapp_cu` FOREIGN KEY (`user_id`) REFERENCES `sbcapp_customuser` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `socialaccount_socialaccount`
--

LOCK TABLES `socialaccount_socialaccount` WRITE;
/*!40000 ALTER TABLE `socialaccount_socialaccount` DISABLE KEYS */;
/*!40000 ALTER TABLE `socialaccount_socialaccount` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `socialaccount_socialapp`
--

DROP TABLE IF EXISTS `socialaccount_socialapp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `socialaccount_socialapp` (
  `id` int NOT NULL AUTO_INCREMENT,
  `provider` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `provider_id` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `client_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `secret` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `key` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `settings` json NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `socialaccount_socialapp`
--

LOCK TABLES `socialaccount_socialapp` WRITE;
/*!40000 ALTER TABLE `socialaccount_socialapp` DISABLE KEYS */;
/*!40000 ALTER TABLE `socialaccount_socialapp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `socialaccount_socialapp_sites`
--

DROP TABLE IF EXISTS `socialaccount_socialapp_sites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `socialaccount_socialapp_sites` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `socialapp_id` int NOT NULL,
  `site_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `socialaccount_socialapp_sites_socialapp_id_site_id_71a9a768_uniq` (`socialapp_id`,`site_id`),
  KEY `socialaccount_socialapp_sites_site_id_2579dee5_fk_django_site_id` (`site_id`),
  CONSTRAINT `socialaccount_social_socialapp_id_97fb6e7d_fk_socialacc` FOREIGN KEY (`socialapp_id`) REFERENCES `socialaccount_socialapp` (`id`),
  CONSTRAINT `socialaccount_socialapp_sites_site_id_2579dee5_fk_django_site_id` FOREIGN KEY (`site_id`) REFERENCES `django_site` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `socialaccount_socialapp_sites`
--

LOCK TABLES `socialaccount_socialapp_sites` WRITE;
/*!40000 ALTER TABLE `socialaccount_socialapp_sites` DISABLE KEYS */;
/*!40000 ALTER TABLE `socialaccount_socialapp_sites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `socialaccount_socialtoken`
--

DROP TABLE IF EXISTS `socialaccount_socialtoken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `socialaccount_socialtoken` (
  `id` int NOT NULL AUTO_INCREMENT,
  `token` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `token_secret` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` datetime(6) DEFAULT NULL,
  `account_id` int NOT NULL,
  `app_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `socialaccount_socialtoken_app_id_account_id_fca4e0ac_uniq` (`app_id`,`account_id`),
  KEY `socialaccount_social_account_id_951f210e_fk_socialacc` (`account_id`),
  CONSTRAINT `socialaccount_social_account_id_951f210e_fk_socialacc` FOREIGN KEY (`account_id`) REFERENCES `socialaccount_socialaccount` (`id`),
  CONSTRAINT `socialaccount_social_app_id_636a42d7_fk_socialacc` FOREIGN KEY (`app_id`) REFERENCES `socialaccount_socialapp` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `socialaccount_socialtoken`
--

LOCK TABLES `socialaccount_socialtoken` WRITE;
/*!40000 ALTER TABLE `socialaccount_socialtoken` DISABLE KEYS */;
/*!40000 ALTER TABLE `socialaccount_socialtoken` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `store_cartitem`
--

DROP TABLE IF EXISTS `store_cartitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `store_cartitem` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `quantity` int NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `date_added` datetime(6) NOT NULL,
  `product_id` bigint NOT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `store_cartitem_user_id_product_id_82818e41_uniq` (`user_id`,`product_id`),
  KEY `store_cartitem_product_id_4238d443_fk_store_product_id` (`product_id`),
  CONSTRAINT `store_cartitem_product_id_4238d443_fk_store_product_id` FOREIGN KEY (`product_id`) REFERENCES `store_product` (`id`),
  CONSTRAINT `store_cartitem_user_id_3ff2f2b5_fk_sbcapp_customuser_id` FOREIGN KEY (`user_id`) REFERENCES `sbcapp_customuser` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store_cartitem`
--

LOCK TABLES `store_cartitem` WRITE;
/*!40000 ALTER TABLE `store_cartitem` DISABLE KEYS */;
/*!40000 ALTER TABLE `store_cartitem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `store_category`
--

DROP TABLE IF EXISTS `store_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `store_category` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store_category`
--

LOCK TABLES `store_category` WRITE;
/*!40000 ALTER TABLE `store_category` DISABLE KEYS */;
INSERT INTO `store_category` VALUES (1,'Pepsi','pepsi','A classic, effervescent cola delivering a timeless, refreshing taste with every satisfying sip.'),(2,'Mirinda','mirinda','A vibrant, fruit-flavored soda, exploding with sweet, bold taste for ultimate refreshment.'),(3,'7up','7up','Experience the crisp, clean burst of lemon-lime flavor; a truly uplifting and refreshing soda.'),(4,'Sting','sting','An electrifying energy drink, providing a powerful jolt and invigorating burst of bold flavor.'),(5,'Evervess','evervess','Premium sparkling soda water, impeccably crisp and perfect for mixing or pure enjoyment.'),(6,'Mountain Dew','mountain-dew','A unique, exhilarating citrus soda, known for its bold taste and signature kick.'),(7,'Aquafina','aquafina','Pure, refreshing bottled water, meticulously purified to deliver crisp, clean hydration.');
/*!40000 ALTER TABLE `store_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `store_category_images`
--

DROP TABLE IF EXISTS `store_category_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `store_category_images` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `category_id` bigint NOT NULL,
  `image_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `store_category_images_category_id_image_id_610da69d_uniq` (`category_id`,`image_id`),
  KEY `store_category_images_image_id_e17e5d33_fk_store_image_id` (`image_id`),
  CONSTRAINT `store_category_images_category_id_2303d6d7_fk_store_category_id` FOREIGN KEY (`category_id`) REFERENCES `store_category` (`id`),
  CONSTRAINT `store_category_images_image_id_e17e5d33_fk_store_image_id` FOREIGN KEY (`image_id`) REFERENCES `store_image` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store_category_images`
--

LOCK TABLES `store_category_images` WRITE;
/*!40000 ALTER TABLE `store_category_images` DISABLE KEYS */;
INSERT INTO `store_category_images` VALUES (2,1,9),(1,2,2),(6,2,6),(5,3,11),(4,4,10),(9,5,12),(8,6,3),(10,7,13);
/*!40000 ALTER TABLE `store_category_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `store_image`
--

DROP TABLE IF EXISTS `store_image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `store_image` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `image` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `alt_text` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store_image`
--

LOCK TABLES `store_image` WRITE;
/*!40000 ALTER TABLE `store_image` DISABLE KEYS */;
INSERT INTO `store_image` VALUES (2,'images/IMG-20250521-WA0018.jpg','mirinda green apple 2l'),(3,'images/IMG-20250521-WA0019.jpg','mountian dew 500ml'),(4,'images/IMG-20250521-WA0015.jpg','mirinda 500ml'),(5,'images/IMG-20250521-WA0031.jpg','mirinda green apple 350ml'),(6,'images/IMG-20250521-WA0009.jpg','mirinda orange 300ml'),(7,'images/IMG-20250521-WA0002.jpg','7up 2l'),(8,'images/IMG-20250521-WA0013.jpg','pepsi-2l'),(9,'images/IMG-20250521-WA0016.jpg','pepsi-500ml'),(10,'images/IMG-20250521-WA0004.jpg','sting-red'),(11,'images/IMG-20250521-WA0003.jpg','7up 500ml'),(12,'images/IMG-20250521-WA0023.jpg','evervess'),(13,'images/aquafina.webp','aquafina');
/*!40000 ALTER TABLE `store_image` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `store_order`
--

DROP TABLE IF EXISTS `store_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `store_order` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `total_price` decimal(10,2) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order_notes` longtext COLLATE utf8mb4_unicode_ci,
  `user_id` bigint DEFAULT NULL,
  `city` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `store_order_user_id_ae5f7a5f_fk_sbcapp_customuser_id` (`user_id`),
  CONSTRAINT `store_order_user_id_ae5f7a5f_fk_sbcapp_customuser_id` FOREIGN KEY (`user_id`) REFERENCES `sbcapp_customuser` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store_order`
--

LOCK TABLES `store_order` WRITE;
/*!40000 ALTER TABLE `store_order` DISABLE KEYS */;
INSERT INTO `store_order` VALUES (3,10.00,'2025-05-21 12:43:42.537474','Trust Pay','790130642','Avenue de Calabre 38 Woluwe','mestechsln@gmail.com','hjdgysvb',2,'Nairobi','pending','2025-05-21 15:28:30.030131'),(5,170.00,'2025-05-21 12:56:10.255588','Test','0712345678','00677','user44@example.com','string',1,'Nairobi','pending','2025-05-21 15:28:30.030131'),(6,1150.00,'2025-05-21 13:02:28.450162','Duncan Macharia','0757738641','252','danquake2019@gmail.com','awsertygijo',NULL,'Nairobi','pending','2025-05-21 15:28:30.030131'),(7,170.00,'2025-05-21 13:02:28.461347','Test','0712345678','00677','user44@example.com','string',1,'Nairobi','pending','2025-05-21 15:28:30.030131'),(8,1150.00,'2025-05-21 13:02:53.627099','Duncan Macharia','0757738641','252','danquake2019@gmail.com','awsertygijo',NULL,'Nairobi','pending','2025-05-21 15:28:30.030131'),(9,1100.00,'2025-05-21 13:09:02.615895','machaa stores','0757738641','252','danquake2019@gmail.com','asdcfvghn',NULL,'Nairobi','pending','2025-05-21 15:28:30.030131'),(10,1100.00,'2025-05-21 13:11:03.955726','machaa stores','0757738641','252','danquake2019@gmail.com','asdcfvghn',NULL,'Nairobi','pending','2025-05-21 15:28:30.030131'),(11,800.00,'2025-05-21 13:41:41.349534','Duncan Macharia','0757738641','252','danquake2019@gmail.com','WERTYUJIKOP',16,'Nairobi','pending','2025-05-22 11:24:35.652725'),(13,170.00,'2025-05-21 13:49:24.327200','Test','0712345678','00677','user44@example.com','string',1,'Nairobi','pending','2025-05-21 15:28:30.030131'),(14,170.00,'2025-05-21 13:51:13.372293','Test','0712345678','00677','user44@example.com','string',1,'Nairobi','delivered','2025-05-22 13:43:47.033632'),(15,37.97,'2025-05-21 13:55:27.402678','John Doe','1234567890','123 Main Street','john.doe@example.com','Please deliver after 5pm',1,'Nairobi','pending','2025-05-21 15:28:30.030131'),(16,37.97,'2025-05-21 14:02:03.736354','John Doe','1234567890','123 Main Street','john.doe@example.com','Please deliver after 5pm',1,'Nairobi','pending','2025-05-21 15:28:30.030131'),(17,37.97,'2025-05-21 14:20:53.142604','John Doe','1234567890','123 Main Street','john.doe@example.com','Please deliver after 5pm',1,'Nairobi','pending','2025-05-21 15:28:30.030131'),(18,37.97,'2025-05-21 14:26:25.812021','John Doe','1234567890','123 Main Street','john.doe@example.com','Please deliver after 5pm',1,'Nairobi','pending','2025-05-21 15:28:30.030131'),(19,37.97,'2025-05-21 14:27:33.307146','John Doe','1234567890','123 Main Street','john.doe@example.com','Please deliver after 5pm',1,'Nairobi','pending','2025-05-21 15:28:30.030131'),(20,37.97,'2025-05-21 14:30:11.555402','John Doe','1234567890','123 Main Street','john.doe@example.com','Please deliver after 5pm',1,'Nairobi','pending','2025-05-21 15:28:30.030131'),(21,37.97,'2025-05-21 14:31:44.136042','John Doe','1234567890','123 Main Street','john.doe@example.com','Please deliver after 5pm',14,'Nairobi','pending','2025-05-21 15:28:30.030131'),(22,37.97,'2025-05-21 15:01:58.440317','John Doe','1234567890','123 Main Street','pepeaexperience@gmail.com','Please deliver after 5pm',15,'Nairobi','pending','2025-05-21 15:28:30.030131'),(24,800.00,'2025-05-22 10:44:29.181499','Duncan Macharia','0757738641','252','danquake2019@gmail.com','',18,'Nairobi','pending','2025-05-22 10:44:29.182474'),(25,800.00,'2025-05-22 11:11:57.728940','Duncan Macharia','0757738641','252','danquake2019@gmail.com','',18,'Nairobi','pending','2025-05-22 11:11:57.728975'),(26,800.00,'2025-05-22 14:08:36.262644','Ephraim','0728750764','00200','ephraimnorbat@gmail.com','',5,'Nairobi','pending','2025-05-22 14:08:36.263029'),(27,500.00,'2025-05-22 14:13:07.468087','Ephraim Onyango','0728750764','00200','ephraimnorbat@gmail.com','',5,'Nairobi','pending','2025-05-22 14:13:07.468361'),(28,800.00,'2025-05-22 14:16:34.026395','Ephraim Onyango','0728750764','00200','ephraimnorbat@gmail.com','',5,'Nairobi','pending','2025-05-22 14:16:34.026428'),(29,2400.00,'2025-05-22 14:18:08.136195','Ephraim Onyango','0728750764','00200','ephraimnorbat@gmail.com','',5,'Nairobi','paid','2025-05-22 14:53:26.800763'),(30,550.00,'2025-05-22 15:52:56.410723','Ephraim Onyango','0728750764','00200','ephraimnorbat@gmail.com','',5,'Nairobi','pending','2025-05-22 15:52:56.410782'),(31,600.00,'2025-05-22 18:34:41.346800','Duncan Macharia','0757738641','252','danquake2019@gmail.com','',18,'Nairobi','pending','2025-05-22 18:34:41.347935'),(32,1350.00,'2025-05-22 19:19:18.151754','Duncan Macharia','0757738641','252','danquake2019@gmail.com','',18,'Nairobi','pending','2025-05-22 19:19:18.152594'),(33,13200.00,'2025-05-26 09:44:18.824122','machaa stores','0757738641','252','danquake2019@gmail.com','',18,'Nairobi','pending','2025-05-26 09:44:18.825010'),(34,16790.00,'2025-05-26 12:24:49.659106','machaa stores','0757738641','252','danquake2019@gmail.com','',18,'Nairobi','pending','2025-05-26 12:24:49.659147'),(35,9870.00,'2025-05-26 13:27:13.022970','machaa stores','0757738641','252','danquake2019@gmail.com','',18,'Nairobi','pending','2025-05-26 13:27:13.024220'),(36,23000.00,'2025-05-26 14:36:36.492358','machaa stores','0757738641','252','danquake2019@gmail.com','',18,'Nairobi','pending','2025-05-26 14:36:36.494349'),(37,16110.00,'2025-05-26 14:45:38.751585','Ephraim Norbat','0728750764','00200','ephraimnorbat@gmail.com','',5,'Nairobi','pending','2025-05-26 14:45:38.752742'),(38,26680.00,'2025-05-26 14:52:02.340132','Duncan Macharia','0757738641','252','danquake2019@gmail.com','',18,'Nairobi','pending','2025-05-26 14:52:02.340387'),(39,15980.00,'2025-05-26 14:56:31.615874','Ephraim Norbat','0728750764','00200','mestechsln@gmail.com','',19,'Nairobi','pending','2025-05-26 14:56:31.615921'),(40,24000.00,'2025-05-26 14:57:35.215723','machaa stores','0757738641','252','danquake2019@gmail.com','',18,'Nairobi','pending','2025-05-26 14:57:35.215973'),(41,18660.00,'2025-05-26 15:03:15.256847','Ephraim Norbat','0728750764','00200','ephraimnorbat@gmail.com','',5,'Nairobi','pending','2025-05-26 15:03:15.257522'),(42,16800.00,'2025-05-26 15:12:50.471402','Ephraim Norbat','0728750764','00200','ephraimnorbat@gmail.com','',5,'Nairobi','pending','2025-05-26 15:12:50.471729'),(43,16170.00,'2025-05-26 15:27:23.840886','Ephraim Norbat','0728750764','00200','ephraimnorbat@gmail.com','',5,'Nairobi','pending','2025-05-26 15:27:23.843233'),(44,15790.00,'2025-05-26 15:37:43.811687','Ephraim Norbat','0728750764','00200','ephraimnorbat@gmail.com','',5,'Nairobi','pending','2025-05-26 15:37:43.812829'),(45,30000.00,'2025-05-26 15:38:42.640846','machaa stores','0757738641','252','danquake2019@gmail.com','',18,'Nairobi','pending','2025-05-26 15:38:42.641228'),(46,15640.00,'2025-05-26 15:41:15.222346','Ephraim Norbat','0728750764','00200','ephraimnorbat@gmail.com','',5,'Nairobi','pending','2025-05-26 15:41:15.222595'),(47,11930.00,'2025-05-26 15:47:47.131939','Duncan Macharia','0745234400','252','danquake2019@gmail.com','',18,'Nairobi','pending','2025-05-26 15:47:47.132542'),(48,15500.00,'2025-05-26 15:51:48.837555','Ephraim Norbat','0728750764','00200','ephraimnorbat@gmail.com','',5,'Nairobi','pending','2025-05-26 15:51:48.838221'),(49,9870.00,'2025-05-26 15:59:51.853045','Ephraim Norbat','0728750764','00200','ephraimnorbat@gmail.com','',5,'Nairobi','pending','2025-05-26 15:59:51.853328'),(50,14160.00,'2025-05-26 16:02:16.047273','Ephraim Norbat','0728750764','00200','ephraimnorbat@gmail.com','',5,'Nairobi','pending','2025-05-26 16:02:16.047723'),(51,20000.00,'2025-05-27 09:19:43.617206','Graham Moguche','0717334912','Membley','grahammoguche2019@gmail.com','',20,'Nairobi','pending','2025-05-27 09:19:43.617261'),(52,23000.00,'2025-05-27 12:12:18.421900','Phrazy','0712345678','00100','ephraimnorbat@gmail.com','kjdwihdwejbfwhuenfjen',1,'Nairobi','pending','2025-05-27 12:12:18.421944'),(53,23000.00,'2025-05-27 12:20:34.187769','Phrazy','0712345678','00100','ephraimnorbat@gmail.com','kjdwihdwejbfwhuenfjen',1,'Nairobi','pending','2025-05-27 12:20:34.187808'),(54,23000.00,'2025-05-27 12:23:57.693897','Phrazy','0712345678','00100','ephraimnorbat@gmail.com','kjdwihdwejbfwhuenfjen',1,'Nairobi','pending','2025-05-27 12:23:57.694110'),(55,17330.00,'2025-05-27 12:55:27.272855','machaa stores','0757738641','252','danquake2019@gmail.com','',18,'Nairobi','pending','2025-05-27 12:55:27.273483'),(56,11550.00,'2025-05-27 12:57:55.216730','machaa stores','0757738641','252','danquake2019@gmail.com','',18,'Nairobi','pending','2025-05-27 12:57:55.217031'),(57,22970.00,'2025-05-27 14:21:28.189424','machaa stores','0757738641','252','danquake2019@gmail.com','',18,'Nairobi','pending','2025-05-27 14:21:28.190194');
/*!40000 ALTER TABLE `store_order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `store_orderitem`
--

DROP TABLE IF EXISTS `store_orderitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `store_orderitem` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `product_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `order_id` bigint NOT NULL,
  `product_id` bigint DEFAULT NULL,
  `product_image` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `store_orderitem_order_id_acf8722d_fk_store_order_id` (`order_id`),
  KEY `store_orderitem_product_id_f2b098d4_fk_store_product_id` (`product_id`),
  CONSTRAINT `store_orderitem_order_id_acf8722d_fk_store_order_id` FOREIGN KEY (`order_id`) REFERENCES `store_order` (`id`),
  CONSTRAINT `store_orderitem_product_id_f2b098d4_fk_store_product_id` FOREIGN KEY (`product_id`) REFERENCES `store_product` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store_orderitem`
--

LOCK TABLES `store_orderitem` WRITE;
/*!40000 ALTER TABLE `store_orderitem` DISABLE KEYS */;
INSERT INTO `store_orderitem` VALUES (1,'Pepsi 500ml',1,600.00,600.00,10,NULL,NULL),(2,'Pepsi 300 ml',1,500.00,500.00,10,NULL,NULL),(3,'Pepsi 2l',1,800.00,800.00,11,NULL,NULL),(5,'Pepsi 2l',2,800.00,1600.00,18,1,NULL),(6,'Pepsi 300 ml',1,500.00,500.00,18,2,NULL),(7,'Pepsi 2l',2,800.00,1600.00,19,1,NULL),(8,'Pepsi 300 ml',1,500.00,500.00,19,2,NULL),(9,'Pepsi 2l',2,800.00,1600.00,20,1,NULL),(10,'Pepsi 300 ml',1,500.00,500.00,20,2,NULL),(11,'Pepsi 2l',2,800.00,1600.00,21,1,NULL),(12,'Pepsi 300 ml',1,500.00,500.00,21,2,NULL),(13,'Pepsi 2l',2,800.00,1600.00,22,1,NULL),(14,'Pepsi 300 ml',1,500.00,500.00,22,2,NULL),(15,'Pepsi 330 ml',11,470.00,5170.00,43,NULL,NULL),(16,'Pepsi 2l',11,1000.00,11000.00,43,NULL,NULL),(17,'Mirinda Orange 500ml',10,650.00,6500.00,44,NULL,NULL),(18,'Pepsi 330 ml',7,470.00,3290.00,44,NULL,NULL),(19,'Pepsi 2l',6,1000.00,6000.00,44,NULL,NULL),(20,'Pepsi 2l',30,1000.00,30000.00,45,NULL,NULL),(21,'Pepsi 2l',10,1000.00,10000.00,46,NULL,NULL),(22,'Pepsi 330 ml',12,470.00,5640.00,46,NULL,NULL),(23,'Pepsi 330 ml',24,470.00,11280.00,47,NULL,NULL),(24,'Mirinda Orange 500ml',1,650.00,650.00,47,NULL,NULL),(25,'Pepsi 2l',1,1000.00,1000.00,48,NULL,NULL),(26,'Pepsi 330 ml',1,470.00,470.00,48,NULL,NULL),(27,'Mirinda Orange 500ml',1,650.00,650.00,48,NULL,NULL),(28,'Pepsi 500ml',1,650.00,650.00,48,NULL,NULL),(29,'Evervess 300ml',1,730.00,730.00,48,NULL,NULL),(30,'Sting Gold 330ml',2,550.00,1100.00,48,NULL,NULL),(31,'7up 2l',1,1000.00,1000.00,48,NULL,NULL),(32,'Mirinda Green Apple 300ml',5,730.00,3650.00,48,NULL,NULL),(33,'Mirinda Green Apple 500ml',5,650.00,3250.00,48,NULL,NULL),(34,'Mirinda Orange 2litres',3,1000.00,3000.00,48,NULL,NULL),(35,'Pepsi 330 ml',21,470.00,9870.00,49,NULL,NULL),(36,'Mirinda Orange 500ml',16,650.00,10400.00,50,NULL,NULL),(37,'Pepsi 330 ml',8,470.00,3760.00,50,NULL,NULL),(38,'Mirinda Green Apple 2l',10,1000.00,10000.00,51,NULL,NULL),(39,'Pepsi 2l',10,1000.00,10000.00,51,NULL,NULL),(40,'Pepsi',23,1000.00,23000.00,52,1,'https://172.25.9.24:8000/media/product_images/IMG-20250521-WA0013_BRz3VKA.jpg'),(41,'Pepsi',23,1000.00,23000.00,53,1,'https://172.25.9.24:8000/media/product_images/IMG-20250521-WA0013_BRz3VKA.jpg'),(42,'Pepsi',23,1000.00,23000.00,54,1,'https://172.25.9.24:8000/media/product_images/IMG-20250521-WA0013_BRz3VKA.jpg'),(43,'Mountain Dew 2l',2,1000.00,2000.00,55,NULL,NULL),(44,'Mountain Dew 300ml',21,730.00,15330.00,55,NULL,NULL),(45,'Sting Gold 330ml',21,550.00,11550.00,56,NULL,NULL),(46,'Mirinda Fruity 500ml',14,650.00,9100.00,57,NULL,NULL),(47,'Mirinda Green Apple 300ml',19,730.00,13870.00,57,NULL,NULL);
/*!40000 ALTER TABLE `store_orderitem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `store_product`
--

DROP TABLE IF EXISTS `store_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `store_product` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_id` bigint DEFAULT NULL,
  `quantity` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `store_product_category_id_574bae65_fk_store_category_id` (`category_id`),
  CONSTRAINT `store_product_category_id_574bae65_fk_store_category_id` FOREIGN KEY (`category_id`) REFERENCES `store_category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store_product`
--

LOCK TABLES `store_product` WRITE;
/*!40000 ALTER TABLE `store_product` DISABLE KEYS */;
INSERT INTO `store_product` VALUES (1,'Pepsi 2l','A classic, effervescent cola delivering a timeless, refreshing taste with every satisfying sip.',1000.00,'Available',1,'6','pepsi-2l'),(2,'Pepsi 330 ml','A classic, effervescent cola delivering a timeless, refreshing taste with every satisfying sip.',470.00,'Available',1,'12','pepsi-330ml'),(3,'Mirinda Orange 500ml','A vibrant, fruit-flavored soda, exploding with sweet, bold taste for ultimate refreshment.',650.00,'Available',2,'12','mirinda-orange-500ml'),(4,'Pepsi 500ml','Classic cola with a refreshing taste',650.00,'Available',1,'24','pepsi-500ml'),(5,'7up 2l','Experience the crisp, clean burst of lemon-lime flavor; a truly uplifting and refreshing soda.',1000.00,'Available',3,'6','7up-2l'),(6,'Sting Red 330ml','An electrifying energy drink, providing a powerful jolt and invigorating burst of bold flavor.',500.00,'Available',4,'12','sting'),(7,'Sting Gold 330ml','An electrifying energy drink, providing a powerful jolt and invigorating burst of bold flavor.',500.00,'Available',4,'12','sting-gold-330ml'),(8,'Evervess 300ml','Premium sparkling soda water, impeccably crisp and perfect for mixing or pure enjoyment.',730.00,'Available',5,'24','evervess-300ml'),(9,'Mirinda Green Apple 300ml','A vibrant, fruit-flavored soda, exploding with sweet, bold taste for ultimate refreshment.',730.00,'Available',2,'24','mirinda-300ml'),(11,'Mirinda Green Apple 500ml','A vibrant, fruit-flavored soda, exploding with sweet, bold taste for ultimate refreshment.',650.00,'Available',2,'12','mirinda-green-apple-500ml'),(12,'Mirinda Orange 2litres','A vibrant, fruit-flavored soda, exploding with sweet, bold taste for ultimate refreshment.',1000.00,'Available',2,'6','mirinda-orange-2litres'),(13,'Mirinda Orange 330ml','A vibrant, fruit-flavored soda, exploding with sweet, bold taste for ultimate refreshment.',470.00,'Available',2,'12','mirinda-orange-330ml'),(14,'Mirinda Orange 300ml','A vibrant, fruit-flavored soda, exploding with sweet, bold taste for ultimate refreshment.',730.00,'Available',2,'24','mirinda-orange-300ml'),(15,'Mirinda Green Apple 2l','A vibrant, fruit-flavored soda, exploding with sweet, bold taste for ultimate refreshment.',1000.00,'Available',2,'6','mirinda-green-apple-2l'),(16,'Mirinda Green Apple 330ml','A vibrant, fruit-flavored soda, exploding with sweet, bold taste for ultimate refreshment.',470.00,'Available',2,'12','mirinda-green-apple-330ml'),(17,'Mirinda Fruity 2l','A vibrant, fruit-flavored soda, exploding with sweet, bold taste for ultimate refreshment.',1000.00,'Available',2,'6','mirinda-fruity-2l'),(18,'Mirinda Fruity 500ml','A vibrant, fruit-flavored soda, exploding with sweet, bold taste for ultimate refreshment.',650.00,'Available',2,'12','mirinda-fruity-500ml'),(19,'Mirinda Fruity 330ml','A vibrant, fruit-flavored soda, exploding with sweet, bold taste for ultimate refreshment.',470.00,'Available',2,'12','mirinda-fruity-330ml'),(20,'Mirinda Fruity 300ml','A vibrant, fruit-flavored soda, exploding with sweet, bold taste for ultimate refreshment.',730.00,'Available',2,'24','mirinda-fruity-300ml'),(21,'7up 500ml','Experience the crisp, clean burst of lemon-lime flavor; a truly uplifting and refreshing soda.',650.00,'Available',3,'6','7up-500ml'),(22,'7up 330ml','Experience the crisp, clean burst of lemon-lime flavor; a truly uplifting and refreshing soda.',470.00,'Available',3,'12','7up-330ml'),(23,'Mountain Dew 2l','Experience the crisp, clean burst of lemon-lime flavor; a truly uplifting and refreshing soda.',1000.00,'Available',6,'6','mountain-dew-2l'),(24,'Mountain Dew 500ml','Experience the crisp, clean burst of lemon-lime flavor; a truly uplifting and refreshing soda.',650.00,'Available',6,'12','mountain-dew-500ml'),(25,'Mountain Dew 330ml','Experience the crisp, clean burst of lemon-lime flavor; a truly uplifting and refreshing soda.',650.00,'Available',6,'6','mountain-dew-330ml'),(26,'Mirinda Pineapple 500ml','A vibrant, fruit-flavored soda, exploding with sweet, bold taste for ultimate refreshment.',650.00,'Available',2,'6','mirinda-pineapple-500ml'),(27,'Mirinda Pineapple 330ml','A vibrant, fruit-flavored soda, exploding with sweet, bold taste for ultimate refreshment.',470.00,'Available',2,'12','mirinda-pineapple-330ml'),(28,'Mirinda Pineapple 300ml','A vibrant, fruit-flavored soda, exploding with sweet, bold taste for ultimate refreshment.',1000.00,'Available',2,'6','mirinda-pineapple-300ml'),(29,'Mirinda Lemon 500ml','A vibrant, fruit-flavored soda, exploding with sweet, bold taste for ultimate refreshment.',650.00,'Available',2,'12','mirinda-lemon-500ml'),(30,'Mirinda Lemon 2l','A vibrant, fruit-flavored soda, exploding with sweet, bold taste for ultimate refreshment.',1000.00,'Available',2,'6','mirinda-lemon-2l'),(31,'Mirinda Lemon 330ml','A vibrant, fruit-flavored soda, exploding with sweet, bold taste for ultimate refreshment.',470.00,'Available',2,'12','mirinda-lemon-330ml'),(32,'Aquafina','Pure, refreshing bottled water, meticulously purified to deliver crisp, clean hydration.',500.00,'Available',7,'12','aquafina'),(33,'Evervess 330ml','Premium sparkling soda water, impeccably crisp and perfect for mixing or pure enjoyment.',470.00,'Available',5,'12','evervess-330ml'),(34,'Evervess 500ml','Premium sparkling soda water, impeccably crisp and perfect for mixing or pure enjoyment.',650.00,'Available',5,'12','evervess-500ml'),(35,'Mountain Dew 300ml','A unique, exhilarating citrus soda, known for its bold taste and signature kick.',730.00,'Available',6,'24','mountain-dew-300ml'),(36,'Pepsi 300 ml','A classic, effervescent cola delivering a timeless, refreshing taste with every satisfying sip.',730.00,'Available',1,'24','pepsi-300-ml'),(37,'Mirinda Lemon 300ml','A vibrant, fruit-flavored soda, exploding with sweet, bold taste for ultimate refreshment.',730.00,'Available',2,'24','mirinda-lemon-300ml');
/*!40000 ALTER TABLE `store_product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `store_productimage`
--

DROP TABLE IF EXISTS `store_productimage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `store_productimage` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `image` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `alt_text` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store_productimage`
--

LOCK TABLES `store_productimage` WRITE;
/*!40000 ALTER TABLE `store_productimage` DISABLE KEYS */;
INSERT INTO `store_productimage` VALUES (2,'product_images/IMG-20250521-WA0016.jpg','pepsi 500ml'),(3,'product_images/IMG-20250521-WA0006.jpg','mirinda orange 500ml'),(4,'product_images/IMG-20250521-WA0009.jpg','mirinda 500ml'),(5,'product_images/IMG-20250521-WA0016_JBgABg4.jpg','pepsi 330ml'),(6,'product_images/IMG-20250521-WA0013_BRz3VKA.jpg','pepsi 2l'),(7,'product_images/IMG-20250521-WA0002.jpg','7up 2l'),(8,'product_images/IMG-20250521-WA0004.jpg','sting red 330ml'),(9,'product_images/IMG-20250521-WA0000.jpg','sting yellow'),(10,'product_images/IMG-20250521-WA0023.jpg','evervess 330ml'),(11,'product_images/IMG-20250521-WA0031.jpg','mirinda green apple 300ml'),(12,'product_images/IMG-20250521-WA0014.jpg','mirinda orange 2l'),(13,'product_images/IMG-20250521-WA0006_ySIJoTr.jpg','mirinda orange 330ml'),(14,'product_images/IMG-20250521-WA0009_MEsOFjt.jpg','mirinda glass orange 300ml'),(15,'product_images/IMG-20250521-WA0018.jpg','mirinda green apple 2l'),(16,'product_images/IMG-20250521-WA0021.jpg','mirinda green apple 500ml'),(17,'product_images/IMG-20250521-WA0026.jpg','mirinda green apple 330ml'),(18,'product_images/fruity2l.jpg','mirinda fruity 2l'),(19,'product_images/fruity500ml.jpg','mirinda fruity 500ml'),(20,'product_images/fruity-330ml.jpg','mirinda 330ml'),(21,'product_images/glassfruity300ml.jpg','mirinda fruity 300ml'),(22,'product_images/500ml.jpg','7up 500ml'),(23,'product_images/330ml.jpg','7up 330ml'),(24,'product_images/pn-500ml.jpg','mirinda pineapple 500ml'),(25,'product_images/pn330ml.jpg','mirinda pineapple 330ml'),(26,'product_images/pn300ml.jpg','mirinda pineapple 300ml'),(27,'product_images/lemon500ml.jpg','mirinda lemon 500ml'),(28,'product_images/lemon2l.jpg','Mirinda lemon 2l'),(29,'product_images/lemon330ml.jpg','mirinda lemon 330ml'),(30,'product_images/IMG-20250521-WA0001.jpg','mountain dew 2l'),(31,'product_images/500ml_6111ZhO.jpg','mountain dew 500ml'),(32,'product_images/330ml_A08ZIXv.jpg','mountain dew 330ml'),(33,'product_images/aquafina.webp','aquafina'),(34,'product_images/evervess500ml.webp','evervess 330ml'),(35,'product_images/evervess500ml_mqPEhFC.webp','evervess 500ml'),(36,'product_images/The-Bottles-mtn-11.webp','mountain dew 300ml'),(37,'product_images/1000195356.jpg','green apple glass 300ml 2'),(38,'product_images/1000195354.jpg','evervess 300ml 2'),(39,'product_images/1000195352.jpg','mirinda pineapple 300ml 2'),(40,'product_images/1000195351.jpg','mirinda orange 300ml 2'),(41,'product_images/1000195359.jpg','mirinda fruity 300ml 2'),(42,'product_images/1000195357.jpg','pepsi 300ml 2'),(43,'product_images/1000195350.jpg','mirinda lemon 300ml 2');
/*!40000 ALTER TABLE `store_productimage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `store_productimage_products`
--

DROP TABLE IF EXISTS `store_productimage_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `store_productimage_products` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `productimage_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `store_productimage_produ_productimage_id_product__5eb5a670_uniq` (`productimage_id`,`product_id`),
  KEY `store_productimage_p_product_id_114f6af5_fk_store_pro` (`product_id`),
  CONSTRAINT `store_productimage_p_product_id_114f6af5_fk_store_pro` FOREIGN KEY (`product_id`) REFERENCES `store_product` (`id`),
  CONSTRAINT `store_productimage_p_productimage_id_65444203_fk_store_pro` FOREIGN KEY (`productimage_id`) REFERENCES `store_productimage` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store_productimage_products`
--

LOCK TABLES `store_productimage_products` WRITE;
/*!40000 ALTER TABLE `store_productimage_products` DISABLE KEYS */;
INSERT INTO `store_productimage_products` VALUES (8,2,4),(27,3,3),(40,5,2),(10,6,1),(11,7,5),(13,8,6),(15,9,7),(16,10,8),(44,11,9),(19,12,12),(20,13,13),(21,14,14),(22,15,15),(25,16,11),(26,17,16),(28,18,17),(29,19,18),(30,20,19),(31,21,20),(32,22,21),(33,23,22),(34,24,26),(35,25,27),(36,26,28),(37,27,29),(38,28,30),(39,29,31),(41,30,23),(42,31,24),(45,32,25),(46,33,32),(47,34,33),(48,35,34),(49,36,35),(50,37,9),(51,38,8),(52,39,28),(53,40,14),(54,41,20),(55,42,36),(56,43,37);
/*!40000 ALTER TABLE `store_productimage_products` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-30 10:00:00
