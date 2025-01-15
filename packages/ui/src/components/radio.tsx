import { RadioGroup as ChakraRadioGroup } from "@chakra-ui/react";
import * as React from "react";

export interface RadioProps extends ChakraRadioGroup.ItemProps {
  rootRef?: React.Ref<HTMLDivElement>;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  children?: React.ReactNode;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  function Radio(props, ref) {
    const { children, inputProps, rootRef, ...rest } = props;
    return (
      <div ref={rootRef} {...rest}>
        <ChakraRadioGroup.Item>
          <ChakraRadioGroup.ItemHiddenInput ref={ref} {...inputProps} />
          <ChakraRadioGroup.ItemIndicator />
          {children && (
            <ChakraRadioGroup.ItemText>{children}</ChakraRadioGroup.ItemText>
          )}
        </ChakraRadioGroup.Item>
      </div>
    );
  },
);

export const RadioGroup = ChakraRadioGroup.Root;
