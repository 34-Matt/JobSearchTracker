# JobSearchTracker
While searching for jobs, wanted to further my experience with javascript and sql.

## Install

This project was created using npm to manage packages. It is recommend to install the dependencies with:

```bash
npm install
```

Afterwards, the project can be run using:

```bash
node app.js
```

## Usage

The purpose of this project is to aid in tracking information during job searches, including the application itself, company websites, and statuses of the applications. 

The general workflow when using this project is:

1. Apply for a job at a company.
1. Add all the information regarding the company.
1. Add all the information about the application.

The tracker is split into the following sections:

| Page Name | URL | Notes |
| --- | --- | --- |
| [Home](#home-page) | / | The main landing page. Displays list of job applications. |
| [Job Info](#job-info) | /job-info/:id | The information regarding a specific jab application.
| [Job Form](#job-form) | /job-form | Adds information regarding a new job posting |
| [Companies](#companies-page) | /companies | Displays list of interested companies. |
| [Company Form](#company-form) | /company-form | Adds information regarding a new company of interest. |
| [Contacts](#contacts-and-contact-form) | /contacts | Not fully implemented. |
| [Contact Form](#contacts-and-contact-form) | /contact-form | Not fully implemented. |

### Home Page
![Home Page](doc\MainPage.png "Main Page")

This is the main landing page for the tracker.
This page displays general information about all applied job posting.

The main body consists of filtering options, the job list table, and the new job button.

#### Filter
Since many job postings will likely be tracked, filtering options have been provided.
The filtering options are:

* __Days Old:__ How long ago since the tracker has seen an update on the job posting. The recommended value is 30-60 days, though some company will be slower with their recruitment process. When not specified, the age of the application will not be considered in the filtering process.
* __Minimum Status:__ The minimum status for the posting to be displayed. Any job posting with a status greater than or equal to the selected status will be displayed. The recommended value is `Applied`, as it shows all active job posting ~~(and viewing all rejections can be disheartening)~~.

Along with using the provided form, these values can be injected directly into the url with the queries: `/?daysold=30&minimumstatus=1`. Should you want to remove one of these filters, delete the corresponding values from the url.

#### Table
The table provides a brief summary of all the job postings that match the filter.
The short description includes:

* __Company Name:__ The name of the company how posted the job.
* __Position:__ The title of the job.
* __Date Applied:__ The day the job posting was added to the tracker. Shown as `mm/dd/yy`.
* __Status:__ The current status of the application.

The __Position__ section also includes a link that [job information page](#job-info) for the specific application.

#### Button
This button send you to the [job form](#job-form).

### Job Info

### Job Form

### Companies Page

### Company Form

### Contacts and Contact Form

This section has not been fully implemented.
At the moment, this page only tracks the name, email, and phone number of a key contact.