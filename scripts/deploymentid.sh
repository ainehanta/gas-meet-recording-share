#!/bin/bash

set -e

clasp deployments | grep "@HEAD" | awk '{print $2}'