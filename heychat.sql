-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 26, 2023 at 04:33 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `heychat`
--

-- --------------------------------------------------------

--
-- Table structure for table `chats`
--

CREATE TABLE `chats` (
  `Id` int(11) NOT NULL,
  `nPart` int(11) DEFAULT NULL,
  `Owner` int(11) DEFAULT NULL,
  `Name` varchar(32) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `Id` int(11) NOT NULL,
  `Content` varchar(512) DEFAULT NULL,
  `Format` varchar(16) DEFAULT NULL,
  `SendDate` datetime DEFAULT current_timestamp(),
  `UserID` int(11) DEFAULT NULL,
  `ChatsID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `partecipations`
--

CREATE TABLE `partecipations` (
  `UserID` int(11) DEFAULT NULL,
  `ChatID` int(11) DEFAULT NULL,
  `stamp` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `Id` int(11) NOT NULL,
  `Username` varchar(32) NOT NULL,
  `Name` varchar(32) NOT NULL,
  `Surname` varchar(32) NOT NULL,
  `Pwd` varchar(64) NOT NULL,
  `LastAccess` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`Id`, `Username`, `Name`, `Surname`, `Pwd`, `LastAccess`) VALUES
(5, 'Diocane', 'Michele', 'Minafra', '05bd4eba7fc355a413fa7d575ba21f50368e00c935d99c2d42365117d3082e3d', '2023-02-25 21:48:15'),
(16, 'giorgione', 'Giorgio', 'Iacobellis', '4ee3679892e6ac5a5b513eba7fd529d363d7a96508421c5dbd44b01b349cf514', '2023-02-25 22:39:53'),
(17, 'Obama', 'Andrea', 'Matera', '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', '2023-02-25 22:49:15'),
(18, 'MarioRossi123', 'Mario', 'Rossi', '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', '2023-02-25 23:37:25');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chats`
--
ALTER TABLE `chats`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `UserID` (`UserID`),
  ADD KEY `ChatsID` (`ChatsID`);

--
-- Indexes for table `partecipations`
--
ALTER TABLE `partecipations`
  ADD KEY `UserId` (`UserID`),
  ADD KEY `ChatID` (`ChatID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `Username` (`Username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chats`
--
ALTER TABLE `chats`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`Id`),
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`ChatsID`) REFERENCES `chats` (`Id`);

--
-- Constraints for table `partecipations`
--
ALTER TABLE `partecipations`
  ADD CONSTRAINT `partecipations_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`),
  ADD CONSTRAINT `partecipations_ibfk_2` FOREIGN KEY (`ChatID`) REFERENCES `chats` (`Id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
