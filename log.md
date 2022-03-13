# Instructions

```sh
xvfb-run --auto-servernum --server-num=1 go run main.go

gcloud builds submit --tag us-central1-docker.pkg.dev/ping-pong-344008/quickstart-docker-repo/quickstart-image:tag1 .

gcloud run deploy --image=us-central1-docker.pkg.dev/ping-pong-344008/quickstart-docker-repo/quickstart-image:tag1 --platform managed --port 3000 --concurrency 10 --cpu 4 --memory 2Gi --no-cpu-throttling
```
