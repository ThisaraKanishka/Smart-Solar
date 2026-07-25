-- Smart Solar Energy Management System Schema (MySQL / SQLite Compatible)

CREATE TABLE IF NOT EXISTS Packages (
  package_id INT PRIMARY KEY AUTO_INCREMENT,
  package_name VARCHAR(50) NOT NULL,
  capacity_kw DECIMAL(5,2) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  rate_per_kwh DECIMAL(6,2) NOT NULL,
  battery VARCHAR(50) NOT NULL,
  warranty VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS Customers (
  customer_id VARCHAR(20) PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  package_id INT NOT NULL,
  installation_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'Active',
  panel_capacity DECIMAL(5,2) NOT NULL,
  battery_capacity DECIMAL(5,2) NOT NULL,
  role VARCHAR(20) DEFAULT 'customer',
  FOREIGN KEY (package_id) REFERENCES Packages(package_id)
);

CREATE TABLE IF NOT EXISTS Generation (
  generation_id INT PRIMARY KEY AUTO_INCREMENT,
  customer_id VARCHAR(20) NOT NULL,
  date DATE NOT NULL,
  generated_kwh DECIMAL(8,2) NOT NULL,
  used_kwh DECIMAL(8,2) NOT NULL,
  exported_kwh DECIMAL(8,2) NOT NULL,
  battery_charged DECIMAL(8,2) NOT NULL,
  weather VARCHAR(30) NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);

CREATE TABLE IF NOT EXISTS Payments (
  payment_id INT PRIMARY KEY AUTO_INCREMENT,
  customer_id VARCHAR(20) NOT NULL,
  month VARCHAR(20) NOT NULL,
  generated_units DECIMAL(8,2) NOT NULL,
  consumed_units DECIMAL(8,2) NOT NULL,
  exported_units DECIMAL(8,2) NOT NULL,
  rate DECIMAL(6,2) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_status VARCHAR(20) NOT NULL,
  payment_date DATE NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);

CREATE TABLE IF NOT EXISTS Maintenance (
  maintenance_id INT PRIMARY KEY AUTO_INCREMENT,
  customer_id VARCHAR(20) NOT NULL,
  panel_status VARCHAR(50) NOT NULL,
  battery_status VARCHAR(50) NOT NULL,
  inverter_status VARCHAR(50) NOT NULL,
  last_service DATE NOT NULL,
  next_service DATE NOT NULL,
  cleaning_schedule VARCHAR(50) NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);

CREATE TABLE IF NOT EXISTS Notifications (
  notification_id INT PRIMARY KEY AUTO_INCREMENT,
  customer_id VARCHAR(20) NOT NULL,
  title VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'unread',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);
