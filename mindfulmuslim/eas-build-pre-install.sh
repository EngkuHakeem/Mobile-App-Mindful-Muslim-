#!/bin/bash

echo "Enabling Corepack and activating Yarn 4.9.1..."
corepack enable
corepack prepare yarn@4.9.1 --activate