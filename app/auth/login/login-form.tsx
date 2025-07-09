"use client";

import InputControl from "@/components/ui/input-control";
import NavLink from "@/components/ui/nav-link";
import { toaster } from "@/components/ui/toaster";
import { useAuth } from "@/contexts/AuthContext";
import { Flex, IconButton, VStack } from "@chakra-ui/react";
import { Button, Text } from "@chakra-ui/react";
import { Form, Formik, type FormikValues } from "formik";
import { withZodSchema } from "formik-validator-zod";
import { useRouter } from "next/navigation";
import { FaDiscord } from "react-icons/fa";
import { z } from "zod";

export default function LoginForm() {
  const { signIn, signInWithOAuth } = useAuth();
  const router = useRouter();
  const authSchema = z.object({
    email: z
      .string()
      .email("Invalid email address")
      .min(1, "Email is required"),
    password: z.string().min(1, "Password is required"),
  });

  const handleEmailAuth = async (values: FormikValues) => {
    try {
      const { error } = await signIn(values.email, values.password);

      if (error) {
        throw error;
      }

      router.push("/");
    } catch (error) {
      const err = error as Error;
      toaster.create({
        title: "Error",
        description: err.message,
        type: "error",
        duration: 2500,
      });
      console.error("Authentication error:", error);
    }
  };

  const handleOAuthSignIn = async (
    provider: "google" | "github" | "facebook" | "discord",
  ) => {
    try {
      await signInWithOAuth(provider);
    } catch (error) {
      const err = error as Error;
      toaster.create({
        title: "Error",
        description: err.message,
        type: "error",
        duration: 2500,
      });
      console.error("OAuth error:", error);
    }
  };

  return (
    <>
      <Formik<{ email: string; password: string }>
        initialValues={{ email: "", password: "" }}
        initialErrors={{
          email: "Email is required",
          password: "Password is required",
        }}
        validate={withZodSchema(authSchema)}
        onSubmit={(values, { setSubmitting }) => {
          handleEmailAuth(values);
          setSubmitting(false);
        }}
      >
        {({
          isValid,
          isSubmitting,
          touched,
          errors,
          values,
          handleChange,
          handleBlur,
        }) => (
          <Form
            style={{
              width: "100vw",
              maxWidth: "25em",
            }}
          >
            <VStack gap={2}>
              <InputControl
                id="email"
                name="email"
                label="Email Address"
                type="text"
                required={true}
                placeholder="Enter your email address"
                value={values.email}
                handleChange={handleChange}
                handleBlur={handleBlur}
                touched={touched.email}
                errors={errors.email}
              />

              <InputControl
                id="password"
                name="password"
                label="Password"
                type="password"
                required={true}
                placeholder="Enter your password"
                value={values.password}
                handleChange={handleChange}
                handleBlur={handleBlur}
                touched={touched.password}
                errors={errors.password}
              />
              <NavLink
                href="/auth/reset-password"
                alignSelf={"flex-end"}
                fontSize="xs"
              >
                <Text fontSize="sm" textAlign="right">
                  Forgot Password?
                </Text>
              </NavLink>

              <Flex
                marginTop={2}
                gap={4}
                flexDirection="row"
                justifyContent="space-between"
              >
                <Button
                  type="submit"
                  size={"sm"}
                  loading={isSubmitting}
                  disabled={!isValid}
                >
                  Login
                </Button>

                <NavLink
                  href="/auth/register"
                  asButton
                  buttonProps={{ variant: "ghost", size: "sm" }}
                >
                  Don't have an account?
                </NavLink>
              </Flex>
            </VStack>
          </Form>
        )}
      </Formik>

      <Text fontSize="sm" marginTop={4} textAlign="center">
        Or sign in with
      </Text>
      <IconButton
        marginTop={4}
        variant="outline"
        aria-label="Discord"
        onClick={() => handleOAuthSignIn("discord")}
      >
        <FaDiscord />
      </IconButton>
    </>
  );
}
