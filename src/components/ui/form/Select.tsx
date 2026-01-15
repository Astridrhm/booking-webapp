import React, { useEffect, useState } from "react";
// import SelectRS, { Props as SelectRSProps, GroupBase } from "react-select";
import SelectRS, { GroupBase } from "react-select";

interface FlatOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface GroupedOption {
  label: string;
  options: FlatOption[];
}

type SelectOption = FlatOption | GroupedOption;

interface SelectProps {
  options: SelectOption[];
  placeholder?: string;
  onChange: (value: any) => void;
  className?: string;
  defaultValue?: string;
  disabled?: boolean;
  value?: string;
  isGrouped?: boolean;
  // components?: SelectRSProps["components"];
}

const customStyles = {
  control: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isDisabled ? "#f3f6f6ff" : "white",
    borderColor: state.isFocused ? "#63e0f1ff" : "#d1d9dbff",
    boxShadow: state.isFocused ? "0 0 0 3px rgba(122, 221, 241, 0.1)" : "none",
    "&:hover": {
      borderColor: "#63e0f1ff",
    },
    minHeight: "2.75rem",
    fontSize: "0.875rem",
    borderRadius: "0.5rem",
    paddingLeft: "0.75rem",
  }),
  placeholder: (base: any) => ({
    ...base,
    color: "#9ca3af",
  }),
  singleValue: (base: any) => ({
    ...base,
    color: "#1f2937",
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isDisabled
      ? "#f9fafba8"
      : state.isSelected
      ? "#54b8fbff"
      : state.isFocused
      ? "#eef2ff"
      : "white",
    color: state.isDisabled ? "#9c9fa5ff" : state.isSelected ? "white" : "#1f2937",
    padding: 10,
    fontSize: "0.875rem",
    cursor: state.isDisabled ? "not-allowed" : "pointer",
    opacity: state.isDisabled ? 0.6 : 1,
  }),
  menu: (base: any) => ({
    ...base,
    zIndex: 100,
  }),
};

const Select: React.FC<SelectProps> = ({
  options,
  placeholder = "Select Option",
  onChange,
  className = "",
  defaultValue = "",
  disabled = false,
  value,
  isGrouped = false,
  // components,
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const flatOptions = isGrouped
    ? (options as GroupBase<FlatOption>[])
    : (options as FlatOption[]).map((opt) => ({
        value: opt.value,
        label: opt.label,
        isDisabled: opt.disabled,
      }));

  const selected = flatOptions
    .flatMap((opt: any) => (opt.options ? opt.options : [opt]))
    .find((opt: any) => opt.value === value || opt.value === defaultValue);

  return (
    <SelectRS
      className={className}
      isDisabled={disabled}
      placeholder={placeholder}
      options={flatOptions}
      value={selected ?? null}
      onChange={(option) => {
        if (!option) return;
        onChange(isGrouped ? option as FlatOption : (option as FlatOption).value)
      }}
      styles={customStyles}
      isSearchable={true}
      // components={components}
    />
  );
};

export default Select;
