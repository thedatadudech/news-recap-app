import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface ResetButtonProps {
  onReset: () => void;
}

export default function ResetButton({ onReset }: ResetButtonProps) {
  return (
    <Button onClick={onReset} variant="outline" className="flex items-center">
      <RefreshCw className="mr-2 h-4 w-4" />
      Reset
    </Button>
  );
}
