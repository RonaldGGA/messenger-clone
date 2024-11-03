"use client";

import React, { useCallback, useState, useTransition } from "react";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import InputComponent from "./InputComponent";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import AuthSocialButtons from "./authSocialButtons";
import { BsGithub, BsGoogle } from "react-icons/bs";
import axios from "axios";
import { toast } from "sonner";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
type FormType = "LOGIN" | "REGISTER";

const AuthForm: React.FC = () => {
  const router = useRouter();
  const params = useSearchParams();
  const session = useSession();
  const { status } = session;
  const error = params?.get("error");
  React.useEffect(() => {
    if (session?.data) {
      router.push("/users");
    }
    if (error) {
      toast.error(
        "Error loggin in, please use the same method you used the first time"
      );
    }
  }, [error, session, router]);

  // console.log(session);
  const [isPending, startTransition]: [boolean, React.TransitionStartFunction] =
    useTransition();
  const [formType, setFormType] = useState<FormType>("LOGIN");

  const toogleFormType = useCallback(() => {
    if (formType === "LOGIN") {
      setFormType("REGISTER");
    } else {
      setFormType("LOGIN");
    }
  }, [formType]);

  const {
    register, //onChange,onFocus handler
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    startTransition(() => {
      if (formType === "LOGIN") {
        signIn("credentials", {
          ...data,
          redirect: false,
        }).then((callback) => {
          if (callback?.error) {
            toast.error("Invalid credentials");
          } else if (callback?.ok) {
            toast.success("Logged in");
          }
        });
      }
      if (formType === "REGISTER") {
        axios
          .post("/api/auth/register", data)
          .then((res) => {
            if (res.data.success) {
              signIn("credentials", { ...data, redirectTo: "/users" });
              toast.success("Registered Succesfully");
            } else {
              reset();
              toast.error(res.data.message);
            }
          })
          .catch((error) => {
            reset();
            toast.error(error);
          })
          .finally(() => {
            setFormType("LOGIN");
          });
      }
    });
  };
  const socialAction = (action: string) => {
    startTransition(() => {
      if (action === "github") {
        signIn("github", {
          redirect: false,
        });
      } else if (action === "google") {
        signIn("google", {
          redirect: false,
        });
      }
    });
  };
  return (
    <form className="space-y-7 px-5" onSubmit={handleSubmit(onSubmit)}>
      {status == "authenticated" && <div>{JSON.stringify(session.data)}</div>}
      {formType === "REGISTER" && (
        <InputComponent
          register={register}
          type="text"
          placeholder="jhon Doe"
          id="name"
          label="Name"
          errors={errors}
          disabled={isPending}
        />
      )}
      <InputComponent
        register={register}
        type="email"
        placeholder="example@gmail.com"
        id="email"
        label="Email"
        errors={errors}
        disabled={isPending}
        required={true}
      />
      <InputComponent
        register={register}
        type="password"
        placeholder="******"
        id="password"
        label="Password"
        errors={errors}
        disabled={isPending}
        required={true}
      />
      <Button type="submit" size="lg" className="block mx-auto w-[80%]">
        {formType}
      </Button>
      <div>
        <div className="flex items-center justify-normal flex-row my-2">
          <Separator orientation="horizontal" className=" block flex-1" />
          <span className="text-sm text-gray-400 ">Or continue with</span>
          <Separator orientation="horizontal" className=" block flex-1" />
        </div>
        <div className="flex gap-2">
          <AuthSocialButtons
            icon={BsGithub}
            onClick={() => socialAction("github")}
          />
          <AuthSocialButtons
            icon={BsGoogle}
            onClick={() => socialAction("google")}
          />
        </div>
        <div className="text-center mt-3">
          <Button onClick={toogleFormType} variant={"link"}>
            {formType === "LOGIN"
              ? "New to messenger?"
              : "Already have an account?"}{" "}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AuthForm;
