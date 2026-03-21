"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { registerUserThunk } from "@/redux/slices/authSlice";

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    await dispatch(registerUserThunk(data));
    router.push("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name")} placeholder="Name" />
      <input {...register("email")} placeholder="Email" />
      <input type="password" {...register("password")} />
      <button>Register</button>
    </form>
  );
}
