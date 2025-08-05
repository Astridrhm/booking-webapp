import { useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Label from './Label';
import { Calendar } from 'lucide-react';

type PropsType = {
  id: string;
  mode?: "single" | "multiple" | "range" | "time";
  onChange?: flatpickr.Options.Hook | flatpickr.Options.Hook[];
  defaultDate?: Date | Date[] | string | string[] | number | number[];
  minDate?: Date | string | number;
  label?: string;
  placeholder?: string;
};

export default function DatePicker({
  id,
  mode,
  onChange,
  label,
  defaultDate,
  minDate,
  placeholder,
}: PropsType) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const today = new Date().toLocaleDateString('en-CA')

    const instance = flatpickr(`#${id}`, {
      mode: mode || "single",
      static: true,
      monthSelectorType: "static",
      dateFormat: "Y-m-d",
      defaultDate,
      onChange,
      minDate: mode === "range" ? minDate : minDate || today,
      closeOnSelect: mode === "range" ? false : true,
      showMonths: mode === "range" ? (isMobile ? 1 : 2) : 1,
    });

    return () => {
      if (!Array.isArray(instance)) {
        instance.destroy();
      }
    };
  }, []);

  return (
    <div className={`w-full ${mode === 'range' ? 'flatpickr-range-wrapper' : ''}`}>
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className={`relative ${mode === 'range' ? 'z-[999]' : ''}`}>
        <input
          ref={inputRef}
          id={id}
          placeholder={placeholder}
          className={`
            h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 
            focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 
            focus:border-brand-300 focus:ring-brand-500/20 
            dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700  
            dark:focus:border-brand-800
            ${mode === 'range' ? 'range-mode-input' : ''}
          `}
        />
        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          <Calendar className="size-6" />
        </span>
      </div>
    </div>
  );
}
