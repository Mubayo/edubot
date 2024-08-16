#!/bin/bash

# Install R
sudo apt-get update
sudo apt-get install -y r-base

# Set R_HOME environment variable
export R_HOME=$(R RHOME)
echo "R_HOME is set to $R_HOME"

# Add R to PATH
export PATH=$PATH:/usr/bin/R

# Continue with the rest of the deployment process
