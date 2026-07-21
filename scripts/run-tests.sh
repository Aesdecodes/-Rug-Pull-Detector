#!/usr/bin/env bash
set -eo pipefail

echo "=========================================================="
echo "Starting Automated CI/CD Testing Workflow"
echo "Host Environment: Fedora Workstation Compatible"
echo "=========================================================="

# 1. Explicitly manage Docker container socket read/write permissions for sibling container execution
DOCKER_SOCKET="${DOCKER_SOCKET:-/var/run/docker.sock}"

if [ -e "$DOCKER_SOCKET" ]; then
    echo "[CI/CD] Managing Docker socket permissions on $DOCKER_SOCKET..."
    chmod 666 "$DOCKER_SOCKET" 2>/dev/null || sudo chmod 666 "$DOCKER_SOCKET" 2>/dev/null || true
    
    if [ -r "$DOCKER_SOCKET" ] && [ -w "$DOCKER_SOCKET" ]; then
        echo "[CI/CD] Docker socket read/write permissions verified successfully."
    else
        echo "[WARNING] Docker socket permissions check warning: Socket read/write may require elevation."
    fi
else
    echo "[WARNING] Docker socket file $DOCKER_SOCKET not found in runner filesystem context."
fi

# 2. Configure Non-Interactive Environment Flags (prevents hangs on Fedora Workstation)
export CI=true
export DEBIAN_FRONTEND=noninteractive
export PYTHONUNBUFFERED=1

# Trap cleanup to prevent orphaned containers or hangs
cleanup() {
    echo "[CI/CD] Cleaning up test containers..."
    docker rm -f rug-pull-backend-runner rug-pull-frontend-runner 2>/dev/null || true
}
trap cleanup EXIT INT TERM

# 3. Containerize & Execute Backend Predictive Modeling Test Suite
echo "----------------------------------------------------------"
echo "[Step 1/2] Building Backend Test Suite Container..."
docker build -t rug-pull-backend-test -f Dockerfile.Backend-test .

echo "[Step 1/2] Running Backend Test Suite Container..."
docker run --rm \
    --name rug-pull-backend-runner \
    rug-pull-backend-test

echo "[Step 1/2] Backend testing suite executed successfully."

# 4. Containerize & Execute React Frontend Test Suite
echo "----------------------------------------------------------"
echo "[Step 2/2] Building Frontend Test Suite Container..."
# Support both Dockerfile.Frontend-test and fallback Dockerfile.Fronend-test
FRONTEND_DOCKERFILE="Dockerfile.Frontend-test"
if [ ! -f "$FRONTEND_DOCKERFILE" ]; then
    FRONTEND_DOCKERFILE="Dockerfile.Fronend-test"
fi

docker build -t rug-pull-frontend-test -f "$FRONTEND_DOCKERFILE" .

echo "[Step 2/2] Running Frontend Test Suite Container..."
docker run --rm \
    --name rug-pull-frontend-runner \
    -e CI=true \
    rug-pull-frontend-test

echo "[Step 2/2] Frontend testing suite executed successfully."

echo "=========================================================="
echo "Automated CI/CD Testing Workflow Completed Cleanly!"
echo "=========================================================="
