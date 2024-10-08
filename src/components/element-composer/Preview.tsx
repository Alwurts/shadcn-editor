"use client";

import * as React from "react";
import type { ImperativePanelHandle } from "react-resizable-panels";

import { cn } from "@/lib/utils";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui-editor/resizable";
import { Code, Monitor, Smartphone, Tablet, Undo, Redo } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "../ui-editor/toggle-group";
import { Button } from "../ui-editor/button";
import { useComposerStore } from "@/store/useComposerStore";
import { useEffect, useRef, useState } from "react";
import type { CanvasMessageEvent } from "@/types/shadow-composer-store";
import { CodeBlock } from "../code/CodeBlock";

export default function Preview() {
  const [viewerSize, setViewerSize] = useState("100");
  const viewerPanelRef = useRef<ImperativePanelHandle>(null);
  const iframeRef = useComposerStore((state) => state.iframeRef);
  const sendUpdateOfWholeStateToCanvas = useComposerStore(
    (state) => state.sendUpdateOfWholeStateToCanvas
  );
  const handleMessageFromCanvas = useComposerStore(
    (state) => state.handleMessageFromCanvas
  );
  const setSelectedNode = useComposerStore((state) => state.setSelectedNode);
  const undo = useComposerStore((state) => state.undo);
  const redo = useComposerStore((state) => state.redo);
  const historyIndex = useComposerStore((state) => state.historyIndex);
  const historyLength = useComposerStore((state) => state.history.length);

  useEffect(() => {
    sendUpdateOfWholeStateToCanvas();
  }, [sendUpdateOfWholeStateToCanvas]);

  useEffect(() => {
    window.addEventListener("message", handleMessageFromCanvas);
    return () => {
      window.removeEventListener("message", handleMessageFromCanvas);
    };
  }, [handleMessageFromCanvas]);

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <div
      onClick={() => {
        setSelectedNode(null);
      }}
      className="flex-1 relative py-3 pl-4 pr-1 bg-muted-editor flex flex-col gap-2"
    >
      <div className="flex items-center justify-start gap-2">
        <ToggleGroup
          type="single"
          defaultValue="100"
          value={viewerSize}
          onValueChange={(value) => {
            if (viewerPanelRef.current) {
              viewerPanelRef.current.resize(Number.parseInt(value));
              setViewerSize(value);
            }
          }}
          className="items-center gap-1.5 rounded-md border p-1 shadow-sm flex bg-background-editor"
        >
          <ToggleGroupItem value="100" className="h-7 w-7 rounded-sm p-0">
            <Monitor className="h-3.5 w-3.5" />
          </ToggleGroupItem>
          <ToggleGroupItem value="60" className="h-7 w-7 rounded-sm p-0">
            <Tablet className="h-3.5 w-3.5" />
          </ToggleGroupItem>
          <ToggleGroupItem value="35" className="h-7 w-7 rounded-sm p-0">
            <Smartphone className="h-3.5 w-3.5" />
          </ToggleGroupItem>
        </ToggleGroup>

        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="outline"
            onClick={undo}
            disabled={historyIndex <= 0}
            className="flex items-center gap-1"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={redo}
            disabled={historyIndex >= historyLength - 1}
            className="flex items-center gap-1"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>

        <CodeBlock
          button={
            <Button
              size="sm"
              variant="default"
              className="flex items-center gap-1"
            >
              Code
              <Code className="h-4 w-4" />
            </Button>
          }
        />
      </div>
      <div className="flex-1 relative after:absolute after:inset-0 after:right-3 after:z-0 after:rounded-lg after:bg-muted-editor-foreground/25 after:border after:border-border-editor">
        <ResizablePanelGroup direction="horizontal" className="relative z-10">
          <ResizablePanel
            ref={viewerPanelRef}
            order={1}
            className={cn(
              "relative rounded-lg border bg-background border-border"
            )}
            defaultSize={100}
            onResize={(size) => {
              setViewerSize(size.toString());
            }}
            minSize={30}
          >
            <iframe
              ref={iframeRef}
              title="block-preview"
              src={"/composer/canvas"}
              height={"100%"}
              className="relative z-20 w-full bg-background-editor"
            />
          </ResizablePanel>
          <ResizableHandle
            className={cn(
              "relative hidden w-3 bg-transparent p-0 after:absolute after:right-0 after:top-1/2 after:h-8 after:w-[6px] after:-translate-y-1/2 after:translate-x-[-1px] after:rounded-full after:bg-border-editor after:transition-all after:hover:h-10 sm:block"
            )}
          />
          <ResizablePanel defaultSize={0} minSize={0} order={2} />
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
