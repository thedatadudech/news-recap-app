import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

interface VideoCustomizationProps {
  videoLength: number;
  setVideoLength: (length: number) => void;
  preferredStyle: string;
  setPreferredStyle: (style: string) => void;
  includeSubtitles: boolean;
  setIncludeSubtitles: (include: boolean) => void;
}

export default function VideoCustomization({
  videoLength,
  setVideoLength,
  preferredStyle,
  setPreferredStyle,
  includeSubtitles,
  setIncludeSubtitles,
}: VideoCustomizationProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label
          htmlFor="videoLength"
          className="text-sm font-medium text-gray-700"
        >
          News recap duration
        </label>
        <Slider
          id="videoLength"
          min={30}
          max={180}
          step={30}
          value={[videoLength]}
          onValueChange={(value) => setVideoLength(value[0])}
          className="w-full"
        />
        <p className="text-sm text-gray-500">{videoLength} seconds</p>
      </div>
      <div className="space-y-2">
        <label
          htmlFor="preferredStyle"
          className="text-sm font-medium text-gray-700"
        >
          News presentation style
        </label>
        <Select onValueChange={setPreferredStyle} value={preferredStyle}>
          <SelectTrigger id="preferredStyle" className="border-gray-300">
            <SelectValue placeholder="Choose a style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="neutral">Neutral</SelectItem>
            <SelectItem value="formal">Formal Broadcast</SelectItem>
            <SelectItem value="casual">Casual Explainer</SelectItem>
            <SelectItem value="energetic">Dynamic Report</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="subtitles"
          checked={includeSubtitles}
          onCheckedChange={setIncludeSubtitles}
        />
        <label
          htmlFor="subtitles"
          className="text-sm font-medium text-gray-700"
        >
          Include closed captions
        </label>
      </div>
    </div>
  );
}
