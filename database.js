const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const { application } = require('express');

fs.mkdir('config', { recursive: true }, (err) => {
    if (err) {
        console.error('Error creating config directory:', err);
    } else {
        console.log('Config directory is ready.');
    }
});
const dbName = 'config/database.db';

// Open a connection to the database
const db = new sqlite3.Database(dbName, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Create a table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS applied (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  companyid Integer NOT NULL,
  location TEXT NOT NULL,
  submissiondate TEXT NOT NULL,
  status Integer NOT NULL,
  lastupdate TEXT NOT NULL
)`, (err) => {
  if (err) {
    console.error('Error creating table:', err.message);
  } else {
    console.log('Applied table is ready.');
  }
});

db.run(`CREATE TABLE IF NOT EXISTS companies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  industry TEXT NOT NULL,
  contacts TEXT
)`, (err) => {
  if (err) {
    console.error('Error creating table:', err.message);
  } else {
    console.log('Companies table is ready.');
  }
});

db.run(`CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT
)`, (err) => {
  if (err) {
    console.error('Error creating table:', err.message);
  } else {
    console.log('Contacts table is ready.');
  }
});


// CRUD operations for the 'applied' table
const addApplication = (application, callback) => {
    const sql_statement = db.prepare(`INSERT INTO applied (title, url, companyid, location, submissiondate, status, lastupdate) VALUES (?, ?, ?, ?, ?, ?, ?)`);

    const { title, url, companyid, location} = application;
    const submissiondate = new Date().toLocaleString().split(',')[0];
    const status = 1; // Default status is "Applied"
    const lastupdate = submissiondate;

    sql_statement.run([title, url, companyid, location, submissiondate, status, lastupdate], function(err) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, this.lastID);
        }
    });
};

const getApplications = (callback) => {
    const sql = `SELECT * FROM applied`;
    db.all(sql, [], callback);
};

const getApplication = (id, callback) => {
  const sql = `SELECT * FROM applied WHERE id = ?`;
  db.get(sql, [id], callback);
}

const updateApplicationStatus = (id, status, callback) => {
    const sql = `UPDATE applied SET status = ?, lastupdate = ? WHERE id = ?`;
    const lastupdate = new Date().toISOString();

    db.run(sql, [status, lastupdate, id], callback);
};

const deleteApplication = (id, callback) => {
    const sql = `DELETE FROM applied WHERE id = ?`;
    db.run(sql, [id], callback);
};



// CRUD operations for the 'companies' table
const addCompany = (company, callback) => {
    const sql_statement = db.prepare(`INSERT INTO companies (name, url, industry, contacts) VALUES (?, ?, ?, ?)`);

    const { name, url, industry, contacts } = company;

    sql_statement.run([name, url, industry, contacts], function(err) {
        if (err) {
            callback(err, null);
        }
        else {
            callback(null, this.lastID);
        }
    });
};

const getCompanies = (callback) => {
    const sql = `SELECT * FROM companies`;
    db.all(sql, [], callback);
};

const updateCompany = (id, company, callback) => {
    const { name, url, industry, contacts } = company;
    const sql = `UPDATE companies SET name = ?, url = ?, industry = ?, contacts = ? WHERE id = ?`;

    db.run(sql, [name, url, industry, contacts, id], callback);
};

const deleteCompany = (id, callback) => {
    const sql = `DELETE FROM companies WHERE id = ?`;
    db.run(sql, [id], callback);
};

// CRUD operations for the 'contacts' table
const addContact = (contact, callback) => {
    const sql_statement = db.prepare(`INSERT INTO contacts (name, email, phone) VALUES (?, ?, ?)`);

    const { name, email, phone } = contact;

    sql_statement.run([name, email, phone], function(err) {
        if (err) {
            callback(err, null);
        }
        else {
            callback(null, this.lastID);
        }
    });
};

const getContacts = (callback) => {
    const sql = `SELECT * FROM contacts`;
    db.all(sql, [], callback);
};

const updateContact = (id, contact, callback) => {
    const { name, email, phone } = contact;
    const sql = `UPDATE contacts SET name = ?, email = ?, phone = ? WHERE id = ?`;

    db.run(sql, [name, email, phone, id], callback);
};

const deleteContact = (id, callback) => {
    const sql = `DELETE FROM contacts WHERE id = ?`;
    db.run(sql, [id], callback);
};

// Special queries for applications
const getCompaniesOrdered = (callback) => {
    const sql = `SELECT * FROM companies ORDER BY name COLLATE NOCASE`;
    db.all(sql, [], callback);
};

const getApplicationByStatus = (status, callback) => {
  const sql = `SELECT * FROM applied WHERE status = ?`;
  db.all(sql, [status], callback);
};

const getApplicationInfo = (id, callback) => {
  const sql = `
  SELECT
  companies.name,
  applied.title,
  applied.url,
  applied.location,
  applied.status
  FROM
  applied
  INNER JOIN
  companies ON applied.companyid = companies.id
  WHERE
  applied.id = ?`;
  
  db.get(sql, [id], callback);
};

// Format mixing for page rendering
const displayApplications = (callback) => {
  const query = `
  SELECT
  companies.name,
  applied.title,
  applied.submissiondate,
  applied.status,
  applied.id
  FROM
  applied
  INNER JOIN
  companies ON applied.companyid = companies.id;
  WHERE
  applied.status > 1
  `;
  
  db.all(query, [], callback);
};

const getApplicationByCompanyId = (companyid, callback) => {
    const sql = `SELECT * FROM applied WHERE companyid = ?`;
    db.all(sql, [companyid], callback);
};

module.exports = {
  addApplication,
  getApplication,
  getApplications,
  updateApplicationStatus,
  deleteApplication,
  
  addCompany,
  getCompanies,
  updateCompany,
  deleteCompany,
  
  addContact,
  getContacts,
  updateContact,
  deleteContact,
  
  getCompaniesOrdered,
  displayApplications,
  
  getApplicationByCompanyId,
  getApplicationInfo,
  getApplicationByStatus,
};