#!/bin/bash

# 서버 + 클라이언트 동시 실행
trap 'kill 0' EXIT

echo "Starting server..."
npm run server &

echo "Starting client..."
npm run dev &

wait
