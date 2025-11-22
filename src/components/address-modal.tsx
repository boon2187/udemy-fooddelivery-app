import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

export default function AddressModal() {
  return (
    <Dialog>
      <DialogTrigger>住所を選択</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>住所</DialogTitle>
          <DialogDescription className="sr-only">
            住所登録と選択
          </DialogDescription>
        </DialogHeader>
        <Command shouldFilter={false}>
          <div className="bg-muted mb-4">
            <CommandInput placeholder="Type a command or search..." />
          </div>
          <h3 className="font-bold text-lg mb-2">保存済みの住所</h3>
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandItem className="p-5">Calendar</CommandItem>
            <CommandItem className="p-5">Search Emoji</CommandItem>
            <CommandItem className="p-5">Calculator</CommandItem>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
