"use client";

import { createClient } from "@/lib/supabase/client";
import { FormErrorMessage, VStack, useToast } from "@chakra-ui/react";
import { Button, FormControl, Input } from "@chakra-ui/react";
import {
  Field,
  type FieldInputProps,
  Form,
  Formik,
  type FormikProps,
  type FormikValues,
} from "formik";
import { z } from "zod";
import { withZodSchema } from 'formik-validator-zod'

export default function AuthForm() {
  const toast = useToast();
  const supabase = createClient();
  const authSchema = z.object({
    email: z
      .string()
      .email("Invalid email address")
      .min(1, "Email is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character",
      ),
  });

  const handleEmailAuth = async (values: FormikValues) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) throw error;

      window.location.href = "/";
    } catch (error) {
      const err = error as Error;
      toast({
        title: "Error",
        description: err.message,
        status: "error",
        duration: 2500,
        isClosable: true,
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
      toast({
        title: "Error",
        description: err.message,
        status: "error",
        duration: 2500,
        isClosable: true,
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
        {({ isValid, isSubmitting }) => (
          <Form>
            <VStack gap={2}>
              <Field name="email">
                {({
                  field,
                  form: { errors, touched },
                }: {
                  field: FieldInputProps<string>;
                  form: FormikProps<FormikValues>;
                }) => (
                  <FormControl isInvalid={!!errors.email && !!touched.email}>
                    <Input {...field} id="email" type="email" />
                    <FormErrorMessage>{errors.email as string}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="password">
                {({
                  field,
                  form: { errors, touched },
                }: {
                  field: FieldInputProps<string>;
                  form: FormikProps<FormikValues>;
                }) => (
                  <FormControl
                    isInvalid={!!errors.password && !!touched.password}
                  >
                    <Input {...field} id="password" type="password" />
                    <FormErrorMessage>
                      {errors.password as string}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Button
                type="submit"
                disabled={!isValid}
                isLoading={isSubmitting}
              >
                Login
              </Button>
            </VStack>
          </Form>
        )}
      </Formik>
    </>
  );
}
