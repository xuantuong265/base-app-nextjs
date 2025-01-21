"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/atoms/form";
import { Input } from "@/components/atoms/input";

type FormInputTextProps = {
  control: any;
  name: string;
  formLabel?: string;
  className?: string;
  placeholder: string;
  type?: "text" | "password" | "number";
  disabled?: boolean;
  required?: boolean;
};

const FormInputText = ({
  control,
  name,
  className,
  formLabel,
  placeholder,
  disabled = false,
  required = false,
  type = "text",
}: FormInputTextProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {formLabel && <FormLabel>{formLabel}</FormLabel>}
          <FormControl>
            <Input
              placeholder={placeholder}
              type={type}
              disabled={disabled}
              required={required}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormInputText;
