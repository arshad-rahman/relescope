import {
  Select,
} from "@base-ui/react/select";

import {
  Check,
  ChevronDown,
} from "lucide-react";

export type BeautifulSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type Props = {
  id?: string;
  value: string;
  options: BeautifulSelectOption[];
  placeholder: string;
  ariaLabel: string;
  disabled?: boolean;
  onValueChange: (value: string) => void;
};

export default function BeautifulSelect({
  id,
  value,
  options,
  placeholder,
  ariaLabel,
  disabled = false,
  onValueChange,
}: Props) {
  return (
    <Select.Root
      items={options}
      value={value || null}
      disabled={disabled}
      onValueChange={(nextValue) => {
        if (typeof nextValue === "string") {
          onValueChange(nextValue);
        }
      }}
    >
      <Select.Trigger
        id={id}
        aria-label={ariaLabel}
        className="group flex w-full items-center justify-between rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-left text-sm font-medium text-white shadow-sm outline-none transition duration-200 hover:border-cyan-400/30 hover:bg-slate-900 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10 data-[popup-open]:border-cyan-400 data-[popup-open]:bg-slate-900 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
      >
        <Select.Value
          placeholder={placeholder}
          className="min-w-0 flex-1 truncate data-[placeholder]:font-normal data-[placeholder]:text-slate-500"
        />

        <Select.Icon className="ml-3 shrink-0 text-slate-500 transition duration-200 group-hover:text-slate-300 data-[popup-open]:rotate-180 data-[popup-open]:text-cyan-300">
          <ChevronDown className="h-4 w-4" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Positioner
          side="bottom"
          align="start"
          sideOffset={8}
          alignItemWithTrigger={false}
          className="z-[200] w-[var(--anchor-width)]"
        >
          <Select.Popup className="w-[var(--anchor-width)] overflow-hidden rounded-xl border border-cyan-400/20 bg-[#07101f]/95 p-1.5 text-white shadow-[0_24px_70px_-20px_rgba(6,182,212,0.45)] backdrop-blur-xl transition duration-150 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0">
            <Select.List className="max-h-72 space-y-1 overflow-y-auto overscroll-contain p-1">
              {options.map((option) => (
                <Select.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className="group/item flex cursor-default select-none items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 outline-none transition data-[highlighted]:bg-cyan-400/10 data-[highlighted]:text-white data-[selected]:bg-cyan-400/[0.08] data-[selected]:text-cyan-200 data-[disabled]:pointer-events-none data-[disabled]:opacity-40"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-cyan-300 group-data-[selected]/item:border-cyan-400/30 group-data-[selected]/item:bg-cyan-400/10">
                    <Select.ItemIndicator>
                      <Check className="h-3.5 w-3.5" />
                    </Select.ItemIndicator>
                  </span>

                  <Select.ItemText className="min-w-0 flex-1 truncate">
                    {option.label}
                  </Select.ItemText>
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}
