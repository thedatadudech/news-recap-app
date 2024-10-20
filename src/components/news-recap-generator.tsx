"use client";

import { useState, useRef, useEffect } from "react";
import TopicSelector from "./topic-selector";
import VideoCustomization from "./video-customization";
import GenerationProgress from "./generation-progress";
import VideoPreview from "./video-preview";
import ResetButton from "./reset-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronRight, Newspaper, Volume2, VolumeX } from "lucide-react";

export default function NewsRecapGenerator() {
  const [topic, setTopic] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [videoLength, setVideoLength] = useState(60);
  const [preferredStyle, setPreferredStyle] = useState("neutral");
  const [includeSubtitles, setIncludeSubtitles] = useState(true);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationComplete, setGenerationComplete] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const handleGeneration = async () => {
    setGenerationProgress(0);
    setGenerationComplete(false);

    const prompt = `Generate an engaging news recap video. Keep it to ${videoLength} seconds 
    with the latest news in '${
      customTopic || topic
    }' and in a '${preferredStyle}' style.`;
    console.log(prompt);
    const controller = new AbortController();
    const timeoutDuration = 180000; // 3 minutes
    const intervalDuration = 1000; // 1 second
    const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);

    const intervalId = setInterval(() => {
      setGenerationProgress((prevProgress) => {
        const newProgress =
          prevProgress + (intervalDuration / timeoutDuration) * 100;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, intervalDuration);

    try {
      const response = await fetch("http://127.0.0.1:8000/chat/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      clearInterval(intervalId);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.error("Fetch request timed out");
      } else {
        console.error("There was a problem with the fetch operation:", error);
      }
    } finally {
      clearInterval(intervalId); // Ensure interval is cleared
      setGenerationProgress(100);
      setGenerationComplete(true);
      console.log("finally");
    }
  };

  const handleReset = () => {
    setTopic("");
    setCustomTopic("");
    setVideoLength(60);
    setPreferredStyle("neutral");
    setIncludeSubtitles(true);
    setGenerationProgress(0);
    setGenerationComplete(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="relative min-h-screen overflow-hidden w-full h-full">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/newsroom.mp4?height=1080&width=1920" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="relative z-10 w-full max-w-5xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8 bg-gradient-to-r from-red-600 to-red-800 p-4 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold text-white flex items-center">
            <Newspaper className="mr-2 h-8 w-8" />
            AI News Recap
          </h1>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleMute}
              className="bg-white/10 hover:bg-white/20 text-white border-white"
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            <ResetButton onReset={handleReset} />
          </div>
        </div>
        <Card className="bg-white/90 backdrop-blur-md shadow-lg w-full">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-2xl text-gray-800">
              Generate Your Personalized News Recap
            </CardTitle>
            <CardDescription className="text-gray-600">
              Select a topic and customize your video preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 p-6">
            <TopicSelector
              topic={topic}
              setTopic={setTopic}
              customTopic={customTopic}
              setCustomTopic={setCustomTopic}
            />
            <VideoCustomization
              videoLength={videoLength}
              setVideoLength={setVideoLength}
              preferredStyle={preferredStyle}
              setPreferredStyle={setPreferredStyle}
              includeSubtitles={includeSubtitles}
              setIncludeSubtitles={setIncludeSubtitles}
            />
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleGeneration}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Generate My News Recap
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        {generationProgress > 0 && (
          <GenerationProgress
            progress={generationProgress}
            complete={generationComplete}
          />
        )}
        {generationComplete && <VideoPreview />}
      </div>
    </div>
  );
}
