import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
export default function ShoppingListModal({ open, onClose, items }) {
  if (!open) return null;
  const text = items.map((it) => `- ${it}`).join("\n");

  const downloadTxt = () => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "shopping-list.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadCSV = () => {
    const rows = items
      .map((it) => `"${(it || "").replace(/"/g, '""')}"`)
      .join("\n");
    const blob = new Blob([rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "shopping-list.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch (e) {
      console.warn("Clipboard failed", e);
      toast.error("Clipboard error", {
        description: "Could not copy text to clipboard.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Shopping List</DialogTitle>
        </DialogHeader>

        <pre className="max-h-56 overflow-auto whitespace-pre-wrap bg-muted p-3 rounded text-sm">
          {text}
        </pre>

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={downloadTxt}>
            Download TXT
          </Button>
          <Button variant="outline" onClick={downloadCSV}>
            Download CSV
          </Button>
          <Button variant="outline" onClick={copy}>
            Copy
          </Button>
          <Button variant="destructive" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
