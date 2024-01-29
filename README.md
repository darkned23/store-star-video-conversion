
# Store star video conversion

## About the app

This is a web program/server designed to receive video and audio from a user. Internally, it merges the received video with the audio and subsequently sends the processed video to a predefined URL. The objective is to optimize the audio and video merging process by handling it on the server side rather than on the client side (mobile devices).

- CodeGames FOG

## Usage ( step by step )
1. Install docker
2. Create the image with the command below: 
`> docker build -t dev1 .`

3. Initialize the image with the command:
`> docker run -p 3000:3000 -d dev1`

4. Your app is ready!
## API Reference

#### Upload Endpoint

```http
  POST /upload-endpoint
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `client_id` | `string` | **Required**. The client ID by users |
| `file` | `video / mp4` | **Required**. Video that will be combinated |
| `audio` | `audio / mp3` | **Required**. Audio that will join with the video |


#### Async

This is based on asynchronism web workers with NodeJs, so the video processing will be parallel concurrently with web requests / petitions.

#### Server URL
The server url can change easily by .env file, so indeed isn't a major task
## FAQ

#### ¿What por will the app use?

The default port is 3000, but with docker in 3 step u can forward it to another port

#### ¿Do I need install anything else?

No, Docker will install all the necesary files


## Authors

- [@Fscripter](https://www.github.com/fscripter)
- [@darkned23](https://www.github.com/darkned23)

