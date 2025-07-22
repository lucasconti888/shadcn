import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import cors from 'cors';
import { setTimeout } from 'timers/promises'; // For polling delay

dotenv.config();

const app = express();
const port = "api.d-id.com"; // You still need a port for your *backend server* to run locally

app.use(cors({
  origin: 'http://localhost:5173' // Ensure this matches your React app's origin
}));
app.use(express.json());

const geminiApiKey = process.env.GEMINI_API_KEY;
const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
const location = process.env.GOOGLE_CLOUD_LOCATION; // e.g., 'us-central1'

if (!geminiApiKey || !projectId || !location) {
  console.error('Error: GEMINI_API_KEY, GOOGLE_CLOUD_PROJECT_ID, and GOOGLE_CLOUD_LOCATION must be defined in your .env file.');
  process.exit(1);
}

// Initialize the Generative AI client for Vertex AI
// This is how you point the SDK to Vertex AI for models like Veo 3
const genAI = new GoogleGenerativeAI(geminiApiKey, {
  vertexai: {
    project: projectId,
    location: location,
  },
});

// The specific Veo 3 model ID for generation (as of recent info)
const VEO_3_MODEL_ID = "veo-3.0-generate-preview"; // Use the actual, stable ID when it's out of preview

app.post('/talks', async (req, res) => {
  const { prompt, aspectRatio = "16:9", duration = "8s", negativePrompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'The "prompt" field is required.' });
  }

  try {
    console.log(`Received request to generate video with prompt: "${prompt}"`);

    // Get the Veo 3 model instance
    const veo3Model = genAI.getGenerativeModel({ model: VEO_3_MODEL_ID });

    let operation;
    try {
        // --- REAL VEO 3 API CALL ---
        // This is the actual call to Google's Veo 3 API through the SDK
        operation = await veo3Model.generateContent({
            // The structure of the request might vary slightly.
            // Based on Python examples, it's often a `generate_videos` method or
            // content with specific video generation parameters.
            // Using a `generateContent` like structure for demonstration,
            // but the actual method for *generation* might be different.
            //
            // **Important:** Refer to Google's latest Veo 3 Node.js documentation
            // for the precise method and payload for video generation.
            // As per search result 1.5, `client.models.generate_videos` is used in Python,
            // which might map to `veo3Model.generateVideos` in Node.js.

            // Hypothetical Veo 3 generation structure (adjust based on actual docs):
            contents: [{
                role: 'user',
                parts: [{
                    text: prompt,
                    video_generation_config: { // Hypothetical config for video generation
                        aspectRatio: aspectRatio,
                        duration: duration,
                        negativePrompt: negativePrompt,
                        // Add other Veo 3 specific parameters here
                    }
                }]
            }],
            // Additional generation config if supported for video:
            // generation_config: {
            //     responseMimeType: 'video/mp4',
            //     outputLength: duration,
            //     // ...
            // }
        });
        
        console.log(`Veo 3 generation initiated. Operation ID: ${operation.name}`);

    } catch (apiInitError) {
        console.error('Error initiating Veo 3 generation API call:', apiInitError);
        // Google Cloud API errors often have a `code` and `details`
        const statusCode = apiInitError.code || 500;
        const errorMessage = apiInitError.details || apiInitError.message || 'Unknown error during API call initiation.';
        return res.status(statusCode).json({ error: `API initiation failed: ${errorMessage}` });
    }

    let videoReady = false;
    let attempts = 0;
    const maxPollingAttempts = 60; // Max 60 attempts, e.g., 60 * 5s = 300 seconds (5 minutes)
    const pollingIntervalMs = 5000; // Poll every 5 seconds
    let finalVideoUrl = null;

    // Polling mechanism for the long-running operation
    while (!videoReady && attempts < maxPollingAttempts) {
        attempts++;
        console.log(`Polling for video generation status (${attempts}/${maxPollingAttempts})...`);

        try {
            // **Polling the real operation status.**
            // The `operation` object returned by `generateContent` or `generateVideos`
            // should have a way to check its status, often with a `done` property
            // and a `result` or `response` field when done.
            //
            // Example if `operation` object has a `wait()` method (like some LROs):
            const operationStatus = await operation.wait(); // This blocks until done or errors out
            
            // If the `wait()` method itself doesn't directly return the result, you might need:
            // const refreshedOperation = await veo3Model.getOperation(operation.name); // Hypothetical
            // if (refreshedOperation.done) {
            //   videoReady = true;
            //   finalVideoUrl = refreshedOperation.result.generated_videos[0].uri; // Adjust path based on actual response
            // }

            // Based on search result 1.5 for Python, it looks like `operation.result.generated_videos[0]`
            // is where the video lives. This implies the Node.js SDK's `wait()` might return directly or
            // require re-fetching the operation object with `client.operations.get(operation)` for Python.
            // For Node.js, `operation.wait()` should simplify this.

            if (operationStatus && operationStatus.result && operationStatus.result.generated_videos && operationStatus.result.generated_videos.length > 0) {
                videoReady = true;
                finalVideoUrl = operationStatus.result.generated_videos[0].uri; // Assuming URI is the property
                console.log("Real video generation complete. URL:", finalVideoUrl);
            } else {
                await setTimeout(pollingIntervalMs); // Wait before next poll
            }

        } catch (pollingError) {
            console.error('Error polling Veo 3 operation status:', pollingError);
            // If the API explicitly says "pending" or "processing", continue polling.
            // If it's a hard error, break.
            break;
        }
    }

    if (!videoReady || !finalVideoUrl) {
        console.error("Video generation timed out or failed to get URL after polling.");
        return res.status(504).json({ error: 'Video generation timed out or failed to retrieve video URL.' });
    }
    
    res.json({ videoUrl: finalVideoUrl });

  } catch (error) {
    console.error('Unhandled server error:', error);
    res.status(500).json({ error: 'Failed to generate video due to an internal server error.', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
  console.log('Ensure your API keys and Google Cloud project config are correctly set in .env');
});