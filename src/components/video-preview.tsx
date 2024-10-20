import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Check, Play, Share2 } from "lucide-react";

export default function VideoPreview() {
  return (
    <Card className="mt-8 bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-gray-800">
          Your News Recap is Ready!
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
          <video controls className="w-full h-full rounded-lg">
            <source src="/Technology/technology_news.mp4" type="audio/mpeg" />
            Your browser does not support the video tag.
          </video>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" className="text-gray-600 border-gray-300">
          <AlertCircle className="mr-2 h-4 w-4" />
          Report Issue
        </Button>
        <div className="space-x-2">
          <Button variant="outline" className="text-blue-600 border-blue-300">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <Check className="mr-2 h-4 w-4" />
            Approve & Download
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
