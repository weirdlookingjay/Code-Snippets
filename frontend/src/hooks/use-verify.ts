import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { setAuth, finishInitialLoad } from "@/redux/features/authSlice";
import { useVerifyMutation } from "@/redux/features/authApiSlice";

export default function useVerify(skip = false) {
  const [verify] = useVerifyMutation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (skip) return;
    verify()
      .unwrap()
      .then((res) => {
        dispatch(setAuth());
      })
      .catch(() => {})
      .finally(() => {
        dispatch(finishInitialLoad());
      });
  }, [dispatch, verify, skip]);

  return null;
}
