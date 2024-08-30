https://yt-web-client-290092083760.us-central1.run.app/
(If this link stops working I probably stopped paying for Google Cloud)
Architecture:
![image](https://github.com/user-attachments/assets/fc0ecaa4-a194-44ea-a924-91fcd57dcded)
I had so much fun building this project! It was definitely a challenge but the result was totally worth it.
By far the most annoying challenge was an infinite loop that was created when Pub/Sub message was not 
acknowledged within the time limit. I was able to resolve this by switching to pull the Pub/Sub message
instead of pushing it to an Express API. So now the video processing service is running on a Cloud job that
listens for new messages for 23 hours and then times out. I give it 1hr to reset and then it runs on a 
cronjob starting at 3AM every day. A more elegant solution to this would be to run it 24/7 on Kubernetes
but I'm not rich lol. With more budget and time I would serve videos from a CDN rather than directly from 
the bucket as well.
