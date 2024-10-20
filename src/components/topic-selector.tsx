import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface TopicSelectorProps {
  topic: string;
  setTopic: (topic: string) => void;
  customTopic: string;
  setCustomTopic: (topic: string) => void;
}

export default function TopicSelector({
  topic,
  setTopic,
  customTopic,
  setCustomTopic,
}: TopicSelectorProps) {
  const handleTopicChange = (value: string) => {
    setTopic(value);
    setCustomTopic("");
  };

  const handleCustomTopicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomTopic(e.target.value);
    setTopic("");
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="topic" className="text-sm font-medium text-gray-700">
          Select a news category
        </label>
        <Select onValueChange={handleTopicChange} value={topic}>
          <SelectTrigger id="topic" className="border-gray-300">
            <SelectValue placeholder="Choose a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="breaking">Breaking News</SelectItem>
            <SelectItem value="politics">Politics</SelectItem>
            <SelectItem value="technology">Technology</SelectItem>
            <SelectItem value="business">Business</SelectItem>
            <SelectItem value="science">Science & Health</SelectItem>
            <SelectItem value="entertainment">Entertainment</SelectItem>
            <SelectItem value="sports">Sports</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label
          htmlFor="customTopic"
          className="text-sm font-medium text-gray-700"
        >
          Or enter a specific news topic
        </label>
        <Input
          id="customTopic"
          placeholder="E.g., 'Climate change', 'Cryptocurrency', 'Space exploration'"
          value={customTopic}
          onChange={handleCustomTopicChange}
          className="border-gray-300"
        />
      </div>
    </div>
  );
}
