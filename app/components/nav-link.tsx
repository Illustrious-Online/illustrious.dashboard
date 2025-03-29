import {
  Button,
  type ButtonProps,
  Link as ChakraLink,
  type LinkProps as ChakraLinkProps,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { forwardRef } from "react";

interface NavLinkProps extends ChakraLinkProps {
  href: string;
  asButton?: boolean;
  buttonProps?: ButtonProps;
  children: React.ReactNode;
}

const NavLink = forwardRef<HTMLAnchorElement | HTMLButtonElement, NavLinkProps>(
  ({ href, asButton = false, buttonProps, children, ...rest }, ref) => {
    if (asButton) {
      return (
        <NextLink href={href} passHref legacyBehavior>
          <Button
            as="a"
            ref={ref as React.Ref<HTMLButtonElement>}
            {...buttonProps}
          >
            {children}
          </Button>
        </NextLink>
      );
    }

    return (
      <NextLink href={href} passHref legacyBehavior>
        <ChakraLink ref={ref as React.Ref<HTMLAnchorElement>} {...rest}>
          {children}
        </ChakraLink>
      </NextLink>
    );
  },
);

NavLink.displayName = "NavLink";

export default NavLink;
