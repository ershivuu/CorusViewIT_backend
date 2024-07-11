CREATE DATABASE  IF NOT EXISTS `corusview_it` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `corusview_it`;
-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: corusview_it
-- ------------------------------------------------------
-- Server version	8.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `applicant_details`
--

DROP TABLE IF EXISTS `applicant_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `applicant_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `contact` varchar(15) NOT NULL,
  `drop_cv` varchar(255) NOT NULL,
  `applied_for` int DEFAULT NULL,
  `position` varchar(55) NOT NULL,
  `last_ctc` decimal(10,2) NOT NULL,
  `year_of_exp` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `applied_for` (`applied_for`),
  CONSTRAINT `applicant_details_ibfk_1` FOREIGN KEY (`applied_for`) REFERENCES `job_role` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `applicant_details`
--

LOCK TABLES `applicant_details` WRITE;
/*!40000 ALTER TABLE `applicant_details` DISABLE KEYS */;
INSERT INTO `applicant_details` VALUES (12,'shivam','gupta','guptashivam@gmail.com','7452136595','uploads\\1720440808669.pdf',16,'Sr. React js Developer',5.30,'3'),(13,'mayuri','gupta','mahak99@gmail.com','7896214569','uploads\\1720441607867.pdf',16,'Sr. React js Developer',8.20,'2'),(14,'medicaps','sisodiya','mahak99@gmail.com','7896214569','uploads\\1720444101171.pdf',15,'testing',6.50,'1-2'),(15,'rahul','gandhi','gandhi@gmail.com','7452136589','uploads\\1720504647731.pdf',16,'Sr. React js Developer',4.50,'3-4'),(16,'mayuri','sisodiya','mahak99@gmail.com','7415236548','uploads\\1720505452831.pdf',15,'testing',4.50,'2-3'),(17,'medicaps','jain','guptashivam@gmail.com','7415236548','uploads\\1720505828060.pdf',15,'testing',5.60,'1-2'),(18,'mayuri','sisodiya','mahak99@gmail.com','7896214569','uploads\\1720505869247.pdf',15,'szfdgxhcv',6.50,'1-2'),(19,'shivam','yadav','mahak99@gmail.com','7415236548','uploads\\1720506328356.pdf',12,'testing',5.60,'1-2');
/*!40000 ALTER TABLE `applicant_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `career_wys_and_wyg`
--

DROP TABLE IF EXISTS `career_wys_and_wyg`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `career_wys_and_wyg` (
  `id` int NOT NULL AUTO_INCREMENT,
  `heading` varchar(255) DEFAULT NULL,
  `content` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `career_wys_and_wyg`
--

LOCK TABLES `career_wys_and_wyg` WRITE;
/*!40000 ALTER TABLE `career_wys_and_wyg` DISABLE KEYS */;
INSERT INTO `career_wys_and_wyg` VALUES (1,'Transparent Culture:','We believe in open communication and honesty at every level of our organization. What you see is what you get – no hidden agendas or surprises.'),(3,'Collaborative Environment:','You\'ll be part of a supportive team where collaboration is key. We value input from all team members and encourage sharing ideas to drive innovation.'),(11,'Opportunities for Growth:','We\'re committed to your professional development. Expect ongoing training programs, mentorship opportunities, and resources to enhance your skills and advance your career.'),(12,'Exciting Projects:','Get ready to dive into stimulating projects that challenge your creativity and problem-solving skills. You\'ll have the chance to work on cutting-edge solutions that make a real impact in various industries.'),(13,'Competitive Compensation:','Your hard work deserves to be rewarded. We offer competitive compensation packages and benefits that recognize your contributions to our success.'),(14,'Inclusive Culture:','Diversity is our strength. We celebrate and embrace the unique perspectives and talents of every team member. You\'ll feel valued and respected for who you are.'),(15,'Work-Life Balance:','We understand the importance of maintaining a healthy work-life balance. Our flexible work arrangements and supportive policies ensure you can thrive both personally and professionally.'),(16,'Recognition and Appreciation:','Your achievements won\'t go unnoticed. We believe in recognizing and appreciating your efforts, whether it\'s through formal recognition programs or a simple \"thank you\" from your colleagues.'),(17,'Opportunities to Lead:','We empower our team members to take on leadership roles and make a difference. Whether you\'re leading a project or mentoring junior colleagues, you\'ll have the chance to step up and shine.');
/*!40000 ALTER TABLE `career_wys_and_wyg` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carrer_head`
--

DROP TABLE IF EXISTS `carrer_head`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carrer_head` (
  `id` int NOT NULL AUTO_INCREMENT,
  `carrer_heading` varchar(255) DEFAULT NULL,
  `carrer_content` longtext,
  `ryh_heading` varchar(255) DEFAULT NULL,
  `ryh_content` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carrer_head`
--

LOCK TABLES `carrer_head` WRITE;
/*!40000 ALTER TABLE `carrer_head` DISABLE KEYS */;
INSERT INTO `carrer_head` VALUES (1,'EXPLORING EXCITING CAREER OPPORTUNITIES IN IT INNOVATION','At CorusView, we are not just a team; we are a family dedicated to innovation, collaboration, and excellence in every project we undertake. Joining us means embarking on a journey where your skills are nurtured, your creativity is valued, and your career aspirations are supported. We believe in fostering an environment where every individual can thrive and make a real impact in the world of IT services.','Want to join us? Raise your hand.','We\'re a team of innovators, collaborators, and problem-solvers, shaping the future of technology. If you\'re passionate, creative, and ready to contribute, raise your hand and join us on our  mission. Let\'s build something amazing together.');
/*!40000 ALTER TABLE `carrer_head` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carrer_images`
--

DROP TABLE IF EXISTS `carrer_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carrer_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `img_1` varchar(255) DEFAULT NULL,
  `img_1_originalname` varchar(255) DEFAULT NULL,
  `img_2` varchar(255) DEFAULT NULL,
  `img_2_originalname` varchar(255) DEFAULT NULL,
  `img_3` varchar(255) DEFAULT NULL,
  `img_3_originalname` varchar(255) DEFAULT NULL,
  `img_4` varchar(255) DEFAULT NULL,
  `img_4_originalname` varchar(255) DEFAULT NULL,
  `img_5` varchar(255) DEFAULT NULL,
  `img_5_originalname` varchar(255) DEFAULT NULL,
  `img_6` varchar(255) DEFAULT NULL,
  `img_6_originalname` varchar(255) DEFAULT NULL,
  `img_7` varchar(255) DEFAULT NULL,
  `img_7_originalname` varchar(255) DEFAULT NULL,
  `img_8` varchar(255) DEFAULT NULL,
  `img_8_originalname` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carrer_images`
--

LOCK TABLES `carrer_images` WRITE;
/*!40000 ALTER TABLE `carrer_images` DISABLE KEYS */;
INSERT INTO `carrer_images` VALUES (15,'uploads/1720174824679.jpeg','corusview2.jpeg','uploads/1720174824683.jpg','corusview1.jpg','uploads/1720174824687.jpg','corusview3.jpg','uploads/1720174824689.jpeg','corusview4.jpeg','uploads/1720174824704.jpeg','corusview5.jpeg','uploads/1720174824706.jpg','corusview6.jpg','uploads/1720174824707.jpeg','corusview7.jpeg','uploads/1720439456012.png','corusview9.png');
/*!40000 ALTER TABLE `carrer_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company_details`
--

DROP TABLE IF EXISTS `company_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `company_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `company_content` text,
  `story_content` text,
  `vision_content` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company_details`
--

LOCK TABLES `company_details` WRITE;
/*!40000 ALTER TABLE `company_details` DISABLE KEYS */;
INSERT INTO `company_details` VALUES (1,'Corusview IT Services is a top rated web development company which offers high quality reliable web, software and mobile application development services that help us to serve our clients globally and giving them value for their money through are unique offerings models depending on the nature of the projects and their preferences.','Founded with a vision to redefine the standards of IT services, CorusView emerged as a beacon of innovation in the ever-evolving digital landscape. Our journey began with a small team of passionate individuals driven by a shared commitment to excellence and a desire to make a difference.\r\nFrom our humble beginnings, we embarked on a mission to leverage technology to solve real-world challenges and empower businesses to thrive in the digital age. Over the years, we have grown and evolved, expanding our service offerings and honing our expertise to meet the evolving needs of our clients.','At CorusView, our vision is to revolutionize the digital realm by empowering businesses with cutting-edge IT solutions that drive growth, foster innovation, and enhance user experiences. We envision a future where technology seamlessly integrates into every aspect of daily life, empowering individuals and organizations to achieve their full potential.');
/*!40000 ALTER TABLE `company_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_us`
--

DROP TABLE IF EXISTS `contact_us`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_us` (
  `id` int NOT NULL AUTO_INCREMENT,
  `heading` varchar(45) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_us`
--

LOCK TABLES `contact_us` WRITE;
/*!40000 ALTER TABLE `contact_us` DISABLE KEYS */;
INSERT INTO `contact_us` VALUES (1,'Let\'s discuss on something cool together','contact@corusview.com','734976629','C-6, Prateek Palms, Indore-452010, MP');
/*!40000 ALTER TABLE `contact_us` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_us_form`
--

DROP TABLE IF EXISTS `contact_us_form`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_us_form` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `message` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_us_form`
--

LOCK TABLES `contact_us_form` WRITE;
/*!40000 ALTER TABLE `contact_us_form` DISABLE KEYS */;
INSERT INTO `contact_us_form` VALUES (3,'developer','Shivam Gupta','er.shivamsg@gmail.com','Hello There'),(5,'developer','Shivam Gupta','er.shivamsg@gmail.com','hello there'),(8,'Designer','jhvhvc','ibub@gmail.com','bhubhuscbbs'),(9,'SDE Intern','fdsfb','fdsgdb@gmail.com','afds'),(10,'Designer','eascsav','ascasc@gmail.com','jascjas'),(11,'Designer','sdcfsadsd','fsdfds@gmail.comdqw','dqwdwdwef'),(12,NULL,'dscvsf','asdasd@gmail.com','ascasc'),(13,NULL,'das','asdad@gmail.coma','sdasd');
/*!40000 ALTER TABLE `contact_us_form` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `footer`
--

DROP TABLE IF EXISTS `footer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `footer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `footer_color` varchar(7) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `link1` varchar(255) DEFAULT NULL,
  `link2` varchar(255) DEFAULT NULL,
  `link3` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `footer`
--

LOCK TABLES `footer` WRITE;
/*!40000 ALTER TABLE `footer` DISABLE KEYS */;
INSERT INTO `footer` VALUES (1,'#52a4a4','C-6, Prateek Palms, Indore-452010, MP','contact@corusview.com','7314976629','https://fontawesome.com/','https://fontawesome.com/','https://fontawesome.com/');
/*!40000 ALTER TABLE `footer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `header`
--

DROP TABLE IF EXISTS `header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `header` (
  `id` int NOT NULL,
  `header_color1` varchar(7) DEFAULT NULL,
  `header_color2` varchar(7) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `header`
--

LOCK TABLES `header` WRITE;
/*!40000 ALTER TABLE `header` DISABLE KEYS */;
INSERT INTO `header` VALUES (1,'#83c5be','#f3f9e9');
/*!40000 ALTER TABLE `header` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_openings`
--

DROP TABLE IF EXISTS `job_openings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_openings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role` varchar(100) DEFAULT NULL,
  `position` varchar(100) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `posted_date` date DEFAULT NULL,
  `level` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_openings`
--

LOCK TABLES `job_openings` WRITE;
/*!40000 ALTER TABLE `job_openings` DISABLE KEYS */;
INSERT INTO `job_openings` VALUES (1,'developer','full stack developer','on-site','2024-07-02','intermediate'),(4,'Project Management','Project Manager jiiiiiii','on-site wwww','2024-07-02','Mid-Level');
/*!40000 ALTER TABLE `job_openings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_openings_new`
--

DROP TABLE IF EXISTS `job_openings_new`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_openings_new` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_id` int DEFAULT NULL,
  `position` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `posted_date` date DEFAULT NULL,
  `level` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `job_openings_new_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `job_role` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_openings_new`
--

LOCK TABLES `job_openings_new` WRITE;
/*!40000 ALTER TABLE `job_openings_new` DISABLE KEYS */;
INSERT INTO `job_openings_new` VALUES (22,29,'Jr. React Developer','on-site','2024-07-05','intermediate'),(31,28,'Senior','on-site	','2024-07-05','intermediate'),(35,29,'Jr. React Dev','on-site	','2024-07-05','intermediate');
/*!40000 ALTER TABLE `job_openings_new` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_role`
--

DROP TABLE IF EXISTS `job_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_role` (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `role` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_role`
--

LOCK TABLES `job_role` WRITE;
/*!40000 ALTER TABLE `job_role` DISABLE KEYS */;
INSERT INTO `job_role` VALUES (28,'Designer'),(29,'Junior Developer'),(30,'Senior Developer'),(31,'SDE Intern'),(32,'Digital Marketing'),(33,'BDE');
/*!40000 ALTER TABLE `job_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `main_table`
--

DROP TABLE IF EXISTS `main_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `main_table` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `heading_1` varchar(255) DEFAULT NULL,
  `heading_2` varchar(255) DEFAULT NULL,
  `about_us` text,
  `recent_work_heading` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `main_table`
--

LOCK TABLES `main_table` WRITE;
/*!40000 ALTER TABLE `main_table` DISABLE KEYS */;
INSERT INTO `main_table` VALUES (1,'5+ YEARS OF EXPERIENCE IN IT FIELD','WHERE INNOVATION MEETS EXCELLENCE','Corusview IT Services is a top rated web development company which offers high quality reliable web, software and Mobile development services that help us to serve our clients globally and giving them value for their money through are unique offerings models depending on the nature of the projects and their preferences.','Some of our recent works');
/*!40000 ALTER TABLE `main_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `our_services`
--

DROP TABLE IF EXISTS `our_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `our_services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `icon_img` varchar(255) DEFAULT NULL,
  `icon_img_originalname` varchar(255) DEFAULT NULL,
  `heading` varchar(255) DEFAULT NULL,
  `content` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `our_services`
--

LOCK TABLES `our_services` WRITE;
/*!40000 ALTER TABLE `our_services` DISABLE KEYS */;
INSERT INTO `our_services` VALUES (1,'/uploads/1720524193638.jpg','1716980781414.jpg','software development','SD main content  hsuewf wefbuwe fw fubwefwefwe fhuwebuf wejf we fwefbew fuwebfwe fuewbfwe fjwefnwe fuwef wefjwef wefjweuf wejf uwef jwefuewf jwefuwef jwefbwe'),(2,'/uploads/1720526306442.png','resume.png','Mobile Development','mobile development content ');
/*!40000 ALTER TABLE `our_services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `problems`
--

DROP TABLE IF EXISTS `problems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `problems` (
  `problems_id` int NOT NULL AUTO_INCREMENT,
  `service_id` int DEFAULT NULL,
  `problems_inner_heading` varchar(255) DEFAULT NULL,
  `problems_inner_content` text,
  PRIMARY KEY (`problems_id`),
  KEY `service_id` (`service_id`),
  CONSTRAINT `problems_ibfk_1` FOREIGN KEY (`service_id`) REFERENCES `our_services` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `problems`
--

LOCK TABLES `problems` WRITE;
/*!40000 ALTER TABLE `problems` DISABLE KEYS */;
INSERT INTO `problems` VALUES (1,1,'problem inner head  ','problem inner content bbcadsca'),(2,1,'Problem inner heading 2','problem inner contetent  text 2'),(4,2,'Problem inner heading 1 check','problem inner contetent  text 1 check'),(5,2,'Problem inner heading 1 check','problem inner contetent  text 1 check');
/*!40000 ALTER TABLE `problems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `heading` varchar(255) NOT NULL,
  `content` text,
  `video_link` varchar(255) DEFAULT NULL,
  `link1` varchar(255) DEFAULT NULL,
  `link2` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (17,'CViewSurvey','At CorusView,works on a proven C.A.A.G. model which allows you to collect actionable data, and helps you analyze it in a meaningful way. It lets you view your responses graphically and in real time ensuring 360° assessment and swift action delivery.works on a proven C.A.A.G. model which allows you to collect actionable data, and helps you analyze it in a meaningful way. It lets you view your responses graphically and in real time ensuring 360° assessment and swift action delivery','https://www.youtube.com/embed/O5rgp4xbB88?si=XkzwXWyThf5Bg42v','https://cviewsurvey.com/home','https://cviewsurvey.com/how-it-works');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recent_work`
--

DROP TABLE IF EXISTS `recent_work`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recent_work` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `main_table_id` int DEFAULT NULL,
  `img` varchar(255) DEFAULT NULL,
  `img_originalname` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recent_work`
--

LOCK TABLES `recent_work` WRITE;
/*!40000 ALTER TABLE `recent_work` DISABLE KEYS */;
INSERT INTO `recent_work` VALUES (1,NULL,'/uploads/1720520567952.jpg','Dribbble shot HD - 1.jpg',NULL),(3,NULL,'/uploads/1720520561879.jpg','Frame 1.jpg',NULL),(4,NULL,'/uploads/1720439263072.jpg','medicaps.jpg',NULL);
/*!40000 ALTER TABLE `recent_work` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services_details`
--

DROP TABLE IF EXISTS `services_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services_details` (
  `details_id` int NOT NULL AUTO_INCREMENT,
  `service_id` int DEFAULT NULL,
  `services_heading` varchar(255) DEFAULT NULL,
  `services_content` text,
  PRIMARY KEY (`details_id`),
  KEY `service_id` (`service_id`),
  CONSTRAINT `services_details_ibfk_1` FOREIGN KEY (`service_id`) REFERENCES `our_services` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services_details`
--

LOCK TABLES `services_details` WRITE;
/*!40000 ALTER TABLE `services_details` DISABLE KEYS */;
INSERT INTO `services_details` VALUES (1,1,'Software developmentss','mobile development content sssdsvsdsdv'),(2,2,'Mobile development gg','mobile development content ');
/*!40000 ALTER TABLE `services_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services_wyg`
--

DROP TABLE IF EXISTS `services_wyg`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services_wyg` (
  `wyg_id` int NOT NULL AUTO_INCREMENT,
  `service_id` int DEFAULT NULL,
  `heading` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`wyg_id`),
  KEY `services_wyg_ibfk_1` (`service_id`),
  CONSTRAINT `services_wyg_ibfk_1` FOREIGN KEY (`service_id`) REFERENCES `our_services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services_wyg`
--

LOCK TABLES `services_wyg` WRITE;
/*!40000 ALTER TABLE `services_wyg` DISABLE KEYS */;
INSERT INTO `services_wyg` VALUES (1,1,'Service what youll '),(2,1,'Service what youll get  888'),(3,2,'Mobile Development WYG'),(5,2,'Mobile Development WYG 2'),(6,2,'check'),(10,1,'ZZAzzzzzz'),(11,1,'xdcfvghyjukil'),(12,1,'zzzz'),(13,2,'fdsgsdgs');
/*!40000 ALTER TABLE `services_wyg` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `solutions`
--

DROP TABLE IF EXISTS `solutions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `solutions` (
  `solutions_id` int NOT NULL AUTO_INCREMENT,
  `service_id` int DEFAULT NULL,
  `solutions_inner_heading` varchar(255) DEFAULT NULL,
  `solutions_inner_content` text,
  PRIMARY KEY (`solutions_id`),
  KEY `service_id` (`service_id`),
  CONSTRAINT `solutions_ibfk_1` FOREIGN KEY (`service_id`) REFERENCES `our_services` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `solutions`
--

LOCK TABLES `solutions` WRITE;
/*!40000 ALTER TABLE `solutions` DISABLE KEYS */;
INSERT INTO `solutions` VALUES (1,1,'solution inner heading ','solution inner content '),(2,1,'solution inner heading ','solution inner content '),(4,2,'solution inner heading 1check','solution inner content 1 check'),(6,2,'solution inner heading 2','solution inner content 2asas');
/*!40000 ALTER TABLE `solutions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `testimonials`
--

DROP TABLE IF EXISTS `testimonials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `testimonials` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `main_table_id` int DEFAULT NULL,
  `description` text,
  `img` varchar(255) DEFAULT NULL,
  `img_originalname` varchar(255) DEFAULT NULL,
  `designation` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `testimonials`
--

LOCK TABLES `testimonials` WRITE;
/*!40000 ALTER TABLE `testimonials` DISABLE KEYS */;
INSERT INTO `testimonials` VALUES (1,NULL,'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.','/uploads/1720099590777.jpg','pexels-vladalex94-1402787.jpg','CEO','Mr.Bob'),(2,NULL,'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.','/uploads/1720099304573.png','facebook.png','CTO','Mr.Sob'),(3,NULL,'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.','/uploads/1720099269968.jpg','526-Answering-single-page-application-challenges-with-micro-front-end-architecture (1).jpg','CFO','Mr. John');
/*!40000 ALTER TABLE `testimonials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `values_details`
--

DROP TABLE IF EXISTS `values_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `values_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `company_id` int DEFAULT NULL,
  `heading` varchar(255) DEFAULT NULL,
  `content` text,
  PRIMARY KEY (`id`),
  KEY `company_id` (`company_id`),
  CONSTRAINT `values_details_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `company_details` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `values_details`
--

LOCK TABLES `values_details` WRITE;
/*!40000 ALTER TABLE `values_details` DISABLE KEYS */;
INSERT INTO `values_details` VALUES (1,NULL,'Excellence','We are committed to delivering exceptional quality in everything we do. From the smallest task to the most complex project, we strive for excellence, setting high standards and continuously raising the bar to exceed expectations.'),(2,NULL,'Innovation','Innovation is at the heart of everything we do. We embrace creativity, embrace new ideas, and seek out innovative solutions to solve challenges and drive growth. We foster a culture of curiosity and experimentation,'),(3,NULL,'Integrity','We conduct our business with the highest level of integrity and ethics. Transparency, honesty, and accountability are the cornerstones of our interactions with clients, employees, and partners.'),(4,NULL,'Collaboration','Collaboration is key to our success. We believe in the power of teamwork and collaboration, both internally and with our clients and partners.');
/*!40000 ALTER TABLE `values_details` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-07-10 18:06:42
