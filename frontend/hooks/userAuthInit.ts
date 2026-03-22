
"use client";

import { tokenService } from "@/lib/auth-token";
import { useAppDispatch } from "@/redux/hooks";
import { fetchUser, setAuthResolved } from "@/redux/slices/authSlice";
import { useEffect } from "react";

export const useAuthInit = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = tokenService.getToken();

    if (token) {
      dispatch(fetchUser());
    } else {
      dispatch(setAuthResolved());
    }
  }, [dispatch]);
};
