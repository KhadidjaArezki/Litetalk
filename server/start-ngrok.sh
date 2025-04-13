#!/bin/bash
export $(cat .env.production.ngrok | xargs)
npm start
