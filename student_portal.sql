-- phpMyAdmin SQL Dump
-- version 5.0.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Nov 17, 2020 at 10:11 PM
-- Server version: 10.4.14-MariaDB
-- PHP Version: 7.3.23

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `student_portal`
--

-- --------------------------------------------------------

--
-- Table structure for table `subject`
--

CREATE TABLE `subject` (
  `subject_id` int(255) NOT NULL,
  `name` varchar(256) COLLATE utf8_bin NOT NULL,
  `description` varchar(1048) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `subject`
--

INSERT INTO `subject` (`subject_id`, `name`, `description`) VALUES
(1, 'Fakultet', 'Sve informacije i novosti vezane za aktivnosti o fakultetu'),
(3, 'Skript jezici', 'Основе веб програмирања. Проблеми и задаци презентационог, апликационог и слоја сесије референтог OSI и TCP/IP модела.  Основе развоја клијентске стране веб апликација. Улога клијентских технологија у савременим архитектурама веб система. Размена података са различитим слојевима веб апликације. XML технологије за меморисање, обраду и визуелизацију података презентационог слоја. JSON. JSON API. RESTful архитектуре. Oснове JavaScript-a. ES6. DOM. JS библиотеке. AJAX. Развојни оквири. MVC. VueJS. Примена развојних оквира у развоју апликација. Two-way data binding, управљање догађајима, рендеровање података, компоненте, диркетиве, рад са елементима DOM, Dependency Injection.  Основе развоја серверске стране веб апликација. Улога серверских технологија у савременим архитектурама веб система. Размена података са различитим слојевима веб апликације. RESTful архитектуре.'),
(6, 'Softverske komponente', 'Циљеви и предности развоја софтвера заснованог на компонентама. Појам софтверске компоненте. Основне карактеристике софтверске компоненте. Појам физичке и логичке модуларности. Пракса одвајања спецификације од имплементације софтверске компоненте. Поштовање SOLID принципа и примена дизајн патерна у развоју заснованом на компонентама. Документовање софтверске компоненте. Појам билд алата и управљање повезаним компонентама. Преглед савремених билд алата за програмске језике Јава и Пајтон. Стандарди за развој модуларних система за Јава платформу - OSGi i Jigsaw. Софтверске лиценце и верзије. Сервисно оријентисана софтверска архитектура и веб сервиси. Технологије и стандарди за имплементацију веб сервиса - SOAP i REST. Појам микросервиса и поређење са другим архитектурама. Интеграција микросервиса и коминикација између микросервиса. Микросервиси и кориснички интерфејс, микросервиси и базе података. Кораци у провођењу монолитне у микросервисну архитектуру.'),
(7, 'Upravljanje informacijama', 'Основни концепти науке о подацима, Data Science. Историјски преглед развоја метода за складиштење, управљање подацима и извештавање. Моделирање података, њихове семантике, знања и информација: скуп, бинарна релација (key-value, хешинг и индекс), н-арна релација (табела), стабло (XML) и граф. Апстракције и свођење н-арне релације на бинарну, сортирање бинарне релације, индекси, пролази кроз стабло и претраживање графова. Codd-ов релациoни модел. Релациона алгебра као апарат за генерисање извештаја, SQL. Пројектoвање информационог система. Анализа захтева. Логичко пројектовање структуре  и  динамике информационог система, SSA.  Објектно-оријентисани  приступ моделовању информационих система - UML. Aнализа  захтева у објектном приступу. Случајеви  коришћења.  Опис динамике информационог система. Дијаграми  секвенци. Концептуални модел система. ');

-- --------------------------------------------------------

--
-- Table structure for table `subject_news`
--

CREATE TABLE `subject_news` (
  `subject_news_id` int(255) NOT NULL,
  `title` varchar(128) COLLATE utf8_bin NOT NULL,
  `content` varchar(2048) COLLATE utf8_bin NOT NULL,
  `subject_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `subject`
--
ALTER TABLE `subject`
  ADD PRIMARY KEY (`subject_id`);

--
-- Indexes for table `subject_news`
--
ALTER TABLE `subject_news`
  ADD PRIMARY KEY (`subject_news_id`),
  ADD KEY `subject_foreign_key` (`subject_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `subject`
--
ALTER TABLE `subject`
  MODIFY `subject_id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `subject_news`
--
ALTER TABLE `subject_news`
  MODIFY `subject_news_id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `subject_news`
--
ALTER TABLE `subject_news`
  ADD CONSTRAINT `foreign_key` FOREIGN KEY (`subject_id`) REFERENCES `subject` (`subject_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
