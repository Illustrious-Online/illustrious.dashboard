import InputControl from "@/components/input-control";
import NavLink from "@/components/nav-link";
import { toaster } from "@/components/toaster";
import { useAuth } from "@/context/auth-context";
import { createClient } from "@/lib/supabase/client";
import { UserService } from "@/services/user-service";
import { Flex, VStack } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { Form, Formik, type FormikValues } from "formik";
import { withZodSchema } from "formik-validator-zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { set, z } from "zod";

export default function ResetPasswordForm() {
  const auth = useAuth();
  const router = useRouter();
  const supabase = createClient();
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
      const { error: updateError } = await supabase.auth.updateUser({
        password: values.password,
      });

      if (updateError) {
        throw updateError;
      }

      const { error: signOutError } = await supabase.auth.signOut({
        scope: "global",
      });

      if (signOutError) {
        throw signOutError;
      }

      toaster.create({
        title: "Success",
        description:
          "Password updated successfully. You will be redirected to the login page.",
        type: "success",
        duration: 2500,
      });
      setTimeout(() => {
        router.push("/auth/login");
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
    const { loading, session } = auth;
    const setPasswordReset = async () => {
      if (auth.user) {
        await new UserService().updateUser(auth.user?.id, {
          passwordReset: true,
        });
      }
    };

    if (!loading && !session) {
      toaster.create({
        title: "Error",
        description: "You are not authenticated.",
        type: "error",
        duration: 2500,
      });
      setTimeout(() => {
        router.push("/auth/login");
      }, 2500);
    } else {
      setPasswordReset();
    }
  }, [auth, router]);

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
