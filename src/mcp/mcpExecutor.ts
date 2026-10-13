import { AIToolCall, ProjectData } from '@/src/types';

export interface MCPExecutionOptions {
  onNotifyToolActive?: (toolName: string | null) => void;
  maxLoopCount?: number;
}

export class MCPPipelineExecutor {
  private callHistory: string[] = [];
  private maxLoopCount: number;

  constructor(options?: MCPExecutionOptions) {
    this.maxLoopCount = options?.maxLoopCount || 5;
  }

  public async executePipeline(
    toolCalls: AIToolCall[],
    dispatcher: (name: string, params: Record<string, any>) => void,
    onToolStart?: (name: string) => void
  ): Promise<{ success: boolean; executedCount: number; error?: string }> {
    let executedCount = 0;

    for (const tc of toolCalls) {
      const { tool_name, parameters = {} } = tc;

      // Loop Protection Check
      const recentCalls = this.callHistory.slice(-this.maxLoopCount);
      if (recentCalls.length >= this.maxLoopCount && recentCalls.every((n) => n === tool_name)) {
        return {
          success: false,
          executedCount,
          error: `Loop protection triggered for tool: ${tool_name}. Execution paused.`,
        };
      }

      this.callHistory.push(tool_name);
      onToolStart?.(tool_name);

      try {
        dispatcher(tool_name, parameters);
        executedCount++;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return {
          success: false,
          executedCount,
          error: `Tool execution failed on ${tool_name}: ${msg}`,
        };
      }
    }

    return { success: true, executedCount };
  }
}
