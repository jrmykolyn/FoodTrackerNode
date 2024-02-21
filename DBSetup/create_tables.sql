-- foodtracker.company definition

CREATE DATABASE IF NOT EXISTS foodtracker;

USE foodtracker;

CREATE TABLE company (
  companyID int NOT NULL AUTO_INCREMENT,
  companyName varchar(60) NOT NULL,
  parentCompanyName varchar(60) DEFAULT NULL,
  PRIMARY KEY (companyID)
);


-- foodtracker.fcat definition

CREATE TABLE fcat (
  fcatID int NOT NULL AUTO_INCREMENT,
  fcatName varchar(100) DEFAULT NULL,
  PRIMARY KEY (fcatID)
);


-- foodtracker.food definition

CREATE TABLE food (
  foodID int NOT NULL AUTO_INCREMENT,
  foodName varchar(120) NOT NULL,
  foodBrandName varchar(100) DEFAULT NULL,
  PRIMARY KEY (foodID)
);


-- foodtracker.food_fcat definition

CREATE TABLE food_fcat (
  food_fcat_ID int NOT NULL AUTO_INCREMENT,
  fcatID int NOT NULL,
  foodID int NOT NULL,
  PRIMARY KEY (food_fcat_ID),
  KEY food_fcat_FK (foodID),
  KEY food_fcat_FK_1 (fcatID),
  CONSTRAINT food_fcat_FK FOREIGN KEY (foodID) REFERENCES food (foodID),
  CONSTRAINT food_fcat_FK_1 FOREIGN KEY (fcatID) REFERENCES fcat (fcatID)
);


-- foodtracker.store definition

CREATE TABLE store (
  storeID int NOT NULL AUTO_INCREMENT,
  storeName varchar(100) NOT NULL,
  storeAddress varchar(100) NOT NULL,
  companyID int DEFAULT NULL,
  storeCity varchar(60) DEFAULT NULL,
  storePostalCode varchar(10) DEFAULT NULL,
  storeScrapeData tinyint(1) DEFAULT NULL,
  storePhone varchar(30) DEFAULT NULL,
  storeFlyerURL varchar(100) DEFAULT NULL,
  storeLat varchar(60) DEFAULT NULL,
  storeLon varchar(60) DEFAULT NULL,
  PRIMARY KEY (storeID),
  KEY store_FK (companyID),
  CONSTRAINT store_FK FOREIGN KEY (companyID) REFERENCES company (companyID)
);


-- foodtracker.price definition

CREATE TABLE price (
  priceID int NOT NULL AUTO_INCREMENT,
  foodID int NOT NULL,
  storeID int NOT NULL,
  priceSale tinyint(1) DEFAULT NULL,
  priceListing decimal(6,2) NOT NULL,
  priceByWeight decimal(6,2) DEFAULT NULL,
  priceMetric varchar(60) DEFAULT NULL,
  priceWeight varchar(60) DEFAULT NULL,
  priceLink varchar(200) DEFAULT NULL,
  priceDate date NOT NULL,
  PRIMARY KEY (priceID),
  KEY price_FK (storeID),
  KEY price_FK_1 (foodID),
  CONSTRAINT price_FK FOREIGN KEY (storeID) REFERENCES store (storeID),
  CONSTRAINT price_FK_1 FOREIGN KEY (foodID) REFERENCES food (foodID)
);
