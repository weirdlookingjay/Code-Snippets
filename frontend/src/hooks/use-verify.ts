import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { setAuth, finishInitialLoad } from "@/redux/features/authSlice";
import { useVerifyMutation } from "@/redux/features/authApiSlice";

export default function useVerify() {
  const [verify] = useVerifyMutation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    verify()
      .unwrap()
      .then(() => {
        dispatch(setAuth());
      })
      .catch(() => {
        // Optionally handle error
      })
      .finally(() => {
        dispatch(finishInitialLoad());
      });
  }, [dispatch, verify]);

  return null;
}
