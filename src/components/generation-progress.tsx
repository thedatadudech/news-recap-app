import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface GenerationProgressProps {
  progress: number;
  complete: boolean;
}

export default function GenerationProgress({
  progress,
  complete,
}: GenerationProgressProps) {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Generation Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={progress} className="w-full" />
        <p className="mt-2 text-sm text-muted-foreground">
          {complete ? "Generation complete!" : "Generating your news recap..."}
        </p>
      </CardContent>
    </Card>
  );
}
