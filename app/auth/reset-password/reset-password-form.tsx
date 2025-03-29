import InputControl from "@/components/input-control";
import NavLink from "@/components/nav-link";
import { toaster } from "@/components/toaster";
import { createClient } from "@/lib/supabase/client";
import { UserService } from "@/services/user-service";
import { Flex, VStack } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { Form, Formik, type FormikValues } from "formik";
import { withZodSchema } from "formik-validator-zod";
import { z } from "zod";

export default function ResetPasswordForm() {
  const supabase = createClient();
  const authSchema = z.object({
    email: z
      .string()
      .email("Invalid email address")
      .min(1, "Email is required"),
  });

  const handleResetPassword = async (values: FormikValues) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        values.email,
        {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/update-password`,
        },
      );

      if (error) {
        throw error;
      }

      toaster.create({
        title: "Success",
        description: "Check your email for a link to reset your password.",
        type: "success",
        duration: 2500,
      });
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
          handleResetPassword(values);
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
                  Reset Password
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
