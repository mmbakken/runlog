# Runlog

Runlog is a journaling and planning tool to help you get the most out of your training. Runlog first connects your Strava account via OAuth, then it pulls in run data from the Strava API after they have been uploaded.

Running this app locally requires running the [Runlog API](https://github.com/mmbakken/runlog-api) to serve data to the front end and to connect your user account to Strava.

This project is hosted at runlog.dev. Public sign-up is unavailable at this time. Please contact me on Github if you're interested in signing up for an account.

## Getting Started

Clone this repo.
Clone the Runlog API repo and follow instructions for running that app.
See Runlog API scripts for seeding the local database.
Run `$ npm run dev` from the project directory.
Navigate to `localhost:3000`.

## Deployment

Test out the front end build with `$ npm run build` and then serve it locally with `$ npm run preview`.
