#!/bin/bash
export $(cat .env.production.ngrok.local | xargs)
npm run build

