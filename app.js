const express = require('express');
const path = require('path');

const crud = require('./database');
const objectmanager = require('./dataObjects');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(__dirname + '/public'));


// Routes
// Applied Jobs
app.get('/', (req, res) => {
    crud.displayApplications((err, applications) => {
        if (err) {
            console.error('Error retrieving applications:', err);
            res.status(500).send('Error retrieving applications');
        } else {
            for (let i = 0; i < applications.length; i++) {
                applications[i].status = objectmanager.StatusEnum.getStatusText(applications[i].status);
            }
            res.render('index', { applications });
        }
    });
});

app.get('/job-info/:jobid', (req, res) => {
    crud.getApplicationInfo(req.params.jobid, (err, application) => {
        if (err) {
            console.error('Error retrieving application:', err);
            res.status(500).send('Error retrieving application');
        } else if (!application) {
            console.error('Application not found for ID:', req.params.jobid);
            res.status(404).send('Application not found');
        } else {
            console.log(application);
            const render = {
                app: application,
                enum: objectmanager.StatusEnum
            }
            res.render('jobinfo', { render });
        }
    });
});

app.post('/job-info/:jobid', (req, res) => {
    const { new_status } = req.body;
    const { id } = req.params.jobid;

    crud.updateApplicationStatus(id, new_status, (err, application) => {
        if (err) {
            console.error("Failed to update status");
            res.status(500).send("Failed to update status");
        } else {
            res.redirect('/job-info/:jobid')
        }
    });
});


app.get('/job-form', (req, res) => {
    crud.getCompanies((err, companies) => {
        if (err) {
            res.status(500).send('Error retrieving companies');
        } else {
            res.render('jobform', { companies });
        }
    });
});

app.post('/submit-job', express.urlencoded({ extended: true }), (req, res) => {
    const { job_title, job_url, job_location, job_company } = req.body;
    const application = {
        title: job_title,
        url: job_url,
        companyid: parseInt(job_company, 10),
        location: job_location
    };

    crud.addApplication(application, (err, applicationId) => {
        if (err) {
            res.status(500).send('Error adding application');
            console.error(err);
        } else {
            res.redirect('/');
        }
    });
});

// Companies
app.get('/companies', (req, res) => {
    crud.getCompaniesOrdered((err, companies) => {
        if (err) {
            res.status(500).send('Error retrieving companies');
        } else {
            res.render('companylist', { companies });
        }
    });
});

app.get('/company-form', (req, res) => {
    res.render('companyform');
});

app.post('/submit-company', express.urlencoded({ extended: true }), (req, res) => {
    const { comp_name, comp_url, comp_indust } = req.body;
    const company = {
        name: comp_name,
        url: comp_url,
        industry: comp_indust
    };

    crud.addCompany(company, (err, companyId) => {
        if (err) {
            res.status(500).send('Error adding company');
            console.error(err);
        } else {
            res.redirect('/companies');
        }
    });
});

// Contacts
app.get('/contacts', (req, res) => {
    crud.getContacts((err, contacts) => {
        if (err) {
            res.status(500).send('Error retrieving contacts');
        } else {
            res.render('contactlist', { contacts });
        }
    });
});

app.get('/contact-form', (req, res) => {
    res.render('contactform');
});


const hostname = '127.0.0.1'
const port = 3000;

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});