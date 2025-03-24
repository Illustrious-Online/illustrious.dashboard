"use client";

import { toaster } from "@/app/components/toaster";
import { createClient } from "@/lib/supabase/client";
import { IconButton, VStack } from "@chakra-ui/react";
import { Button, Field, Input } from "@chakra-ui/react";
import { Form, Formik, type FormikValues } from "formik";
import { withZodSchema } from "formik-validator-zod";
import { FaDiscord } from "react-icons/fa";
import { z } from "zod";

export default function LoginForm() {
  const supabase = createClient();
  const authSchema = z.object({
    email: z
      .string()
      .email("Invalid email address")
      .min(1, "Email is required"),
    password: z
      .string()
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character",
      )
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .min(1, "Password is required"),
  });

  const handleEmailAuth = async (values: FormikValues) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        throw error;
      }

      window.location.href = "/";
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

  const handleOAuthSignIn = async (provider: "google" | "discord") => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
        },
      });

      if (error) throw error;
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
      <Formik
        validate={withZodSchema(authSchema)}
        initialValues={{
          email: "",
          password: "",
        }}
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
          <Form>
            <VStack gap={2}>
              <Field.Root required invalid={touched.email && !!errors.email}>
                <Field.Label>
                  Email
                  <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Field.ErrorText>{errors.email}</Field.ErrorText>
              </Field.Root>
              <Field.Root
                required
                invalid={touched.password && !!errors.password}
              >
                <Field.Label>
                  Password
                  <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Field.ErrorText>{errors.password}</Field.ErrorText>
              </Field.Root>
              <Button type="submit" loading={isSubmitting} disabled={!isValid}>
                Login
              </Button>
            </VStack>
          </Form>
        )}
      </Formik>

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
