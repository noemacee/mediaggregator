#!/bin/bash

# Backend API Base URL
BASE_URL="https://mediaggregator-production.up.railway.app"

echo "=========================================="
echo "Testing Mediaggregator Backend API"
echo "Base URL: $BASE_URL"
echo "=========================================="
echo ""

# Health Check
echo "1. Health Check"
echo "----------------------------------------"
curl -X GET "https://mediaggregator-production.up.railway.app/health" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n" \
  | jq '.' 2>/dev/null || cat
echo ""
echo ""

# Get All Media Sources
echo "2. Get All Media Sources"
echo "----------------------------------------"
curl -X GET "https://mediaggregator-production.up.railway.app/api/media-sources" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n" \
  | jq '.' 2>/dev/null || cat
echo ""
echo ""

# Get Articles (with pagination)
echo "3. Get Articles (limit 20)"
echo "----------------------------------------"
curl -X GET "$BASE_URL/api/articles?limit=20&offset=0" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n" \
  | jq '.' 2>/dev/null || cat
echo ""
echo ""

# Get Publications
echo "4. Get Publications"
echo "----------------------------------------"
curl -X GET "$BASE_URL/api/publications?latest_only=true" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n" \
  | jq '.' 2>/dev/null || cat
echo ""
echo ""

# Get Publication Stats
echo "5. Get Publication Stats"
echo "----------------------------------------"
curl -X GET "$BASE_URL/api/publications/stats" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n" \
  | jq '.' 2>/dev/null || cat
echo ""
echo ""

# Get Articles by Media Source (if you have a source ID)
echo "6. Get Articles (first 10, no filter)"
echo "----------------------------------------"
curl -X GET "$BASE_URL/api/articles?limit=10" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n" \
  | jq '.data | length' 2>/dev/null || echo "Response received"
echo ""
echo ""

echo "=========================================="
echo "Testing Complete"
echo "=========================================="

