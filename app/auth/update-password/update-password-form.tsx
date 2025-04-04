"use client";

import InputControl from "@/components/ui/input-control";
import NavLink from "@/components/ui/nav-link";
import { toaster } from "@/components/ui/toaster";
import { useAuth } from "@/contexts/AuthContext";
import { UserService } from "@/services/user-service";
import { Flex, VStack } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { Form, Formik, type FormikValues } from "formik";
import { withZodSchema } from "formik-validator-zod";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { set, z } from "zod";

export default function ResetPasswordForm() {
  const { isLoading, user, session, updatePassword, signOut } = useAuth();
  const authSchema = z
    .object({
      password: z
        .string()
        .min(1, "Password is required")
        .min(8, "Password must be at least 8 characters")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(
          /[@$!%*?&]/,
          "Password must contain at least one special character",
        ),
      confirmPassword: z.string().min(1, "Password confirmation is required"),
    })
    .superRefine(({ confirmPassword, password }, ctx) => {
      if (confirmPassword !== password) {
        ctx.addIssue({
          code: "custom",
          message: "The passwords did not match",
          path: ["confirmPassword"],
        });
      }
    });

  const handleUpdatePassword = async (values: FormikValues) => {
    try {
      const { error: updateError } = await updatePassword(values.password);

      if (updateError) {
        throw updateError;
      }

      await signOut();

      toaster.create({
        title: "Success",
        description:
          "Password updated successfully. You will be redirected to the login page.",
        type: "success",
        duration: 2500,
      });
      setTimeout(() => {
        redirect("/auth/login");
      }, 2500);
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

  useEffect(() => {
    const setPasswordReset = async () => {
      if (user) {
        await new UserService().updateUser(user?.id, {
          passwordReset: true,
        });
      }
    };

    if (!isLoading && !session) {
      toaster.create({
        title: "Error",
        description: "You are not authenticated.",
        type: "error",
        duration: 2500,
      });
      setTimeout(() => {
        redirect("/auth/login");
      }, 2500);
    } else {
      setPasswordReset();
    }
  }, [isLoading, session, user]);

  return (
    <>
      <Formik<{ password: string; confirmPassword: string }>
        initialValues={{ password: "", confirmPassword: "" }}
        initialErrors={{
          password: "Password is required",
          confirmPassword: "Password confirmation is required",
        }}
        validate={withZodSchema(authSchema)}
        onSubmit={(values, { setSubmitting }) => {
          handleUpdatePassword(values);
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

              <InputControl
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                required={true}
                placeholder="Confirm your password"
                value={values.confirmPassword}
                handleChange={handleChange}
                handleBlur={handleBlur}
                touched={touched.confirmPassword}
                errors={errors.confirmPassword}
              />

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
                  Update Password
                </Button>
              </Flex>
            </VStack>
          </Form>
        )}
      </Formik>

      <NavLink
        href="/auth/login"
        asButton
        buttonProps={{ variant: "plain" }}
        marginTop={4}
      >
        Back to Login
      </NavLink>
    </>
  );
}
